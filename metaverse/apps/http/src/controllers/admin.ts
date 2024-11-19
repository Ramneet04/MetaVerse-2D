import { Request, Response } from "express";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../types";
const client = require("@repo/db/client");

export const CreateElement = async (req: Request, res: Response)=>{
    const parsedData = CreateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"});
        return;
    }

    const element = await client.element.create({
        data: {
            width: parsedData.data.width,
            height: parsedData.data.height,
            static: parsedData.data.static,
            imageUrl: parsedData.data.imageUrl,
        }
    })
    res.json({message: "Element Created successfully", id: element.id});
    return;

}

export const UpdateElementImage = async (req: Request, res: Response)=>{
    const parsedData = UpdateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"});
        return;
    }

    await client.element.update({
        where: {
            id: parsedData.data.id
        },
        data: {
            imageUrl: parsedData.data.imageUrl
        }
    });
    res.json({message: "Element Image Updated successfully"});
    return;
}

export const CreateAvatar = async (req: Request, res: Response)=>{
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"});
        return;
    }

    const avatar = await client.avatar.create({
        data: {
            imageUrl : parsedData.data.imageUrl,
            name: parsedData.data.name
        }
    })
    res.json({message: "Avatar Created successfully", id: avatar.id});
    return;
}

export const CreateMap = async (req: Request, res: Response)=>{
    const parsedData = CreateMapSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({message: "Validation failed"});
        return;
    }

    const map = await client.map.create({
        data: {
            name: parsedData.data.name,
            width: parsedData.data.dimentions.split("x")[0], // make sure to parseINT if error arrise
            height: parsedData.data.dimentions.split("x")[0],
            thumbNail: parsedData.data.thumbNail,
            mapElements: {
                create: parsedData.data.defaultElements.map((element) => ({
                    elementId: element.elementId,
                    x: element.x,
                    y: element.y,
                }))
            }
        }
    })
    res.json({
        message: "Map Created successfully",
        id: map.id
    })
    return;
}