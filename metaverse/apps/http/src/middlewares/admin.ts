declare global {
    namespace Express {
        export interface Request {
            role? : "Admin" | "User";
            userId? : String;
        }
    }
}

import jwt  from "jsonwebtoken";
import { NextFunction, Request, Response } from "express"
import { JWT_PASSWORD } from "../config";
export const adminMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];
    if(!token){
        return res.status(403).json({message: "Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as {role: string, userId: string};
        if(decoded.role !== "Admin"){
            return res.status(403).json({message: "Unauthorized"})
        }
        req.userId = decoded.userId;
        next();

    } catch (error) {
        return res.status(403).json({
            message: "Invalid token",
        })
    }
}