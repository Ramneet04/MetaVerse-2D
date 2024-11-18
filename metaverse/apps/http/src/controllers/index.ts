import { Request, Response } from "express";
import { SigninSchema, SignupSchema } from "../types";
const client = require("@repo/db/client");

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../config";
export const SignupController = async (req: Request, res: Response)=>{
    const parsedData = SignupSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({message:"Validation fail"});
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password,10);
        const signupResponse = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin" ? "Admin" : 'User',
            }
        })
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