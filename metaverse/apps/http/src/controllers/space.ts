import { Request, Response } from "express";
import { AddElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../types";
const client = require("@repo/db/client");

export const  CreateSpace = async (req: Request,res: Response)=>{

    const parsedData = CreateSpaceSchema.safeParse(req.body);
    // if the validation fails return response
    if(!parsedData.success){
        res.status(400).json({message: "Validation failed"});
        return;
    }
    // 1st case if mapId is not present which means user is trying to create a empty space
    if(!parsedData.data.mapId){
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: parsedData.data.dimentions.split("x")[0],
                height:  parsedData.data.dimentions.split("x")[1],
                creatorId: req.userId
            }
        });
        res.json({
            spaceId: space.id,
            message: "Space created successfully",
        })
        return;
    }
    // 2nd case if mapId is present which means user is trying to create a space for the mapId already exist and we need to create a space that particular map only
    const map = await client.map.findUnique({
        where:{
            id: parsedData.data.mapId
        },
        select: {
            mapElements: true,
            width: true,
            height: true,
        }
    })

    if(!map){
        res.status(403).json({message: "Map not found"});
        return;
    }

    // transactions means either both of them go through or none of them, if one fails so all the opertions in the transaction fails, so all needs to be passed if we need to create a space. more likely a ACID property.

    const spaceAns = await client.$transaction(async ()=>{
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: map.width,
                height:  map.height,
                creatorId: req.userId,
            }
        })
        await client.spaceElements.createMany({
            data: map.mapElements.map((e:any)=>(
                {
                    spaceId: space.id,
                    elementId: e.elementId,
                    x: e.x,
                    y:e.y,     
                }
            ))
        })
        return space;
    })

    res.json({
        spaceId: spaceAns.id,
        message: "Space created successfully",
    })
    return;

}

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
    
    const parsedData = DeleteElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({message: "Invalid data"});
        return;
    }
    


}