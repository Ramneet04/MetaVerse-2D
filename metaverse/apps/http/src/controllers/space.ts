import { Request, Response } from "express";
import { AddElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../types";
const client = require("@repo/db/client");

export const CreateSpace = async (req: Request, res: Response) => {
    const parsedData = CreateSpaceSchema.safeParse(req.body);

    // Validation check
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" });
        return;
    }

    // Case 1: Creating an empty space if mapId is not provided
    if (!parsedData.data.mapId) {
        try {
            const space = await client.space.create({
                data: {
                    name: parsedData.data.name,
                    width: parseInt(parsedData.data.dimensions.split("x")[0]),
                    height: parseInt(parsedData.data.dimensions.split("x")[1]),
                    creatorId: req.userId!
                },
            });
            res.json({
                spaceId: space.id,
                message: "Space created successfully",
            });
        } catch (error) {
            console.error("Error creating empty space:", error);
            res.status(500).json({ message: "Failed to create space" });
        }
        return;
    }

    // Case 2: Creating a space for an existing map
    try {
        const map = await client.map.findFirst({
            where: { id: parsedData.data.mapId },
            select: {
                mapElements: true,
                width: true,
                height: true,
            },
        });

        if (!map) {
            res.status(403).json({ message: "Map not found" });
            return;
        }
        // create space with mapId
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId!,
            },
        });

        try {
            // Create the elements
            await client.spaceElements.createMany({
                data: map.mapElements.map((e: any) => ({
                    spaceId: space.id,
                    elementId: e.elementId,
                    x: e.x!,
                    y: e.y!,
                })),
            });

            res.json({
                spaceId: space.id,
                message: "Space created successfully",
            });
        } catch (error) {
            console.error("Error creating space elements, rolling back:", error);

            // Rollback: Delete the space if elements creation fails
            await client.space.delete({ where: { id: space.id } });

            res.status(500).json({ message: "Failed to create space elements, space rolled back" });
        }
    } catch (error) {
        console.error("Error creating space or fetching map:", error);
        res.status(500).json({ message: "Failed to create space" });
    }
};


export const DeleteSpace = async (req: Request, res: Response)=>{

    const space = await client.space.findUnique({
        where:{
            id: req.params.spaceId,
        },
        select: {
            creatorId : true,
        }
    });

    if(!space){
        res.status(400).json({message: "Space not found"});
        return;
    }

    if(space.creatorId !== req.userId){
        res.status(403).json({message: "You don't have permission to delete this space"});
        return;
    }

    await client.space.delete({
        where: {
            id: req.params.spaceId,
        }
    });

    res.status(200).json({
        message: "Space deleted successfully",
    })
    return;

}

export const GetAllSpaces = async (req: Request, res: Response)=>{
    const spaces = await client.space.findMany({
        where: {
            creatorId: req.userId,
        }
    });

    res.json({
        spaces: spaces.map((space: any) =>({
            id: space.id,
            name: space.name,
            thumbNail: space.thumbNail,
            dimesntions: `${space.width}x${space.height}`
        }))
    })
    return;
}

export const AddElementInSpace = async (req: Request, res: Response)=>{
    const parsedData = AddElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({message: "Invalid data"});
        return;
    }
    const space = await client.space.findUnique({
        where: {
            id: req.body.spaceId,
            creatorId: req.userId,
        },
        select: {
            width: true,
            height: true,
        }
    })
    if(req.body.x < 0 || req.body.y < 0 || req.body.x > space?.width! || req.body.y > space?.height!) {
        res.status(400).json({message: "Point is outside of the boundary"})
        return
    }
    console.log("why here");
    if(!space) {
        res.status(400).json({message: "Space not found"});
        return;
    }

    await client.spaceElements.create({
        data: {
            spaceId: req.body.spaceId,
            elementId: req.body.elementId,
            x: req.body.x,
            y: req.body.y,

        }
    })

    res.json({
        message: "Element added successfully"
    })
    return;
}

export const DeleteElementInSpace = async (req: Request, res: Response)=>{
    console.log("deleteeee tessttt 0");
    const parsedData = DeleteElementSchema.safeParse(req.body);
    console.log("delete test1");
    console.log(parsedData.data?.id);
    if(!parsedData.success){
        res.status(400).json({message: "Invalid data"});
        return;
    }
    console.log("delete test2");
    const spaceElement = await client.spaceElements.findFirst({
        where: {
            id: parsedData.data.id,
        },
        include: {
            space:true,
        }
    })
    console.log("delete test3");
    if(!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId){
        res.status(403).json({message: "You don't have permission to delete this element"});
        return;
    }

    await client.spaceElements.delete({
        where:{
            id: parsedData.data.id,
        }
    })

    res.json({
        message: "Element deleted successfully"
    })
    return;

}

export const GetSpace = async (req: Request, res: Response)=>{
    const space = await client.space.findUnique({
        where: {
            id : req.params.spaceId
        },
        include: {
            elements: {
                include: {
                    element: true
                }
            },
        }
    })
    if(!space){
        res.status(400).json({message: "Space not found"})
        return;
    }

    res.json({
        dimensions: `${space.width}x${space.height}`,
        elements: space.elements.map((spaceElement: any) => ({
            id: spaceElement.id,            
            x: spaceElement.x,              
            y: spaceElement.y,              
            elementId: spaceElement.elementId, 
            element: {                      // Populated the Actual Element data
                id: spaceElement.element.id,
                width: spaceElement.element.width,
                height: spaceElement.element.height,
                static: spaceElement.element.static,
                imageUrl: spaceElement.element.imageUrl,
            },
        })),
    });
    return;

}
