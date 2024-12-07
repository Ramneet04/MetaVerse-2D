import { Request, Response } from "express";
import { SigninSchema, SignupSchema } from "../types";
const client = require("@repo/db/client");
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../config";

export const SignupController = async (req: Request, res: Response)=>{
   console.log(req.body.username);
   console.log(req.body.password);
   console.log(req.body.avatarId);
   console.log(req.body.type);
    const parsedData = SignupSchema.safeParse(req.body);
   console.log("hii");
    if(!parsedData.success){
        res.status(400).json({message:"Validation fail"});
        return;
    }
    console.log('hiii22');
    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password,10);
        let signupResponse;
        if(parsedData.data?.avatarId){
            signupResponse = await client.user.create({
                data: {
                    username: parsedData.data.username,
                    password: hashedPassword,
                    role: parsedData.data.type === "admin" ? "Admin" : 'User',
                    avatarId:parsedData.data.avatarId,
                }
            })
        }
        else{
            signupResponse = await client.user.create({
                data: {
                    username: parsedData.data.username,
                    password: hashedPassword,
                    role: parsedData.data.type === "admin" ? "Admin" : 'User',
                }
            })
        }
        res.status(200).json({
            message:"signup success",
            userId: signupResponse.id
        })
    } catch (error) {
        res.status(400).json({
            message: "User already exist",
        })
    }
};

export const SigninController = async ( req: Request, res: Response) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({message:"Validation fail"});
        return;
    }

    try {
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            } 
        })
        if(!user){
            res.status(403).json({message:"User not found"})
            return;
        }
        const isValidPassword = await bcrypt.compare(parsedData.data.password, user.password);
        if(!isValidPassword){
            res.status(403).json({message:"Invalid password"})
            return;
        }
        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, JWT_PASSWORD);

        res.status(200).json({
            token,
            message:"signIn success"
        })
    } catch (error) {
       res.status(400).json({
        message: "Internal server error"
       }) 
    }
}

export const GetAvailableElements = async (req: Request, res: Response)=>{
    try {
        const elements = await client.element.findMany()

    res.json({elements: elements.map((val:any) => ({
        id: val.id,
        imageUrl: val.imageUrl,
        width: val.width,
        height: val.height,
        static: val.static
    }))})
    return;
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    }
}

export const GetAvailableAvatars = async (req: Request, res: Response)=>{
    try {
        const avatars = await client.avatar.findMany();
        res.json({avatars: avatars.map(( x:any) => ({
            id: x.id,
            imageUrl: x.imageUrl,
            name: x.name
        }))})
        return;
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        })
    } 
}