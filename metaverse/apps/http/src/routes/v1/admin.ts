import { Router } from "express";
import { adminMiddleware } from "../../middlewares/admin";
import { CreateAvatar, CreateElement, CreateMap, UpdateElementImage } from "../../controllers/admin";


export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, CreateElement )

adminRouter.put("/element/:elementId", adminMiddleware, UpdateElementImage)

adminRouter.post("avatar", adminMiddleware, CreateAvatar)

adminRouter.post("/map", adminMiddleware, CreateMap)