import { Request, Response } from "express";
import { updateMetadataSchema } from "../types";
const client = require("@repo/db/client");

export const UpdateMetadataController = async (req: Request, res: Response)=>{
    const parsedData = updateMetadataSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json(parsedData.error.issues);
        return;
    }

    await client.user.update({
        where: {
            id: req.userId
        },
        data: {
            avatarId: parsedData.data.avatarId
        }
    })
    res.json({ message: "Metadata updated successfully" });
    return;
}

export const OthersMetadataController = async (req: Request, res: Response)=>{
    const userString = (req.query.ids ?? "[]") as string;
    const userIds = (userString).slice(1,userString.length-2).split(",");

    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds,
            }
        },
        select: {
            id: true,
            avatar: true
        }
    })

    const ans= metadata.map( val  =>(
        {
            userId: val.id,
            avatarId: val.avatar?.imageUrl
        }
    ))
    res.json({
        avatars: ans
    })
}