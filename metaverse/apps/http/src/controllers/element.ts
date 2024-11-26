import { Request, Response } from "express";
import { DeleteElementSchema } from "../types";
const client = require("@repo/db/client");

export const deleteElementInSpace = async (req: Request, res: Response)=>{
    console.log("deleteeee tessttt 0");
    console.log("delete test1");
    // console.log(parsedData.data?.id);
    // if(!parsedData.success){
    //     res.status(400).json({message: "Invalid data"});
    //     return;
    // }
    const eleId = req.params.elementId;
    console.log("delete test2");
    const spaceElement = await client.spaceElements.findFirst({
        where: {
            id: eleId,
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
            id: eleId,
        }
    })

    res.json({
        message: "Element deleted successfully"
    })
    return;
}