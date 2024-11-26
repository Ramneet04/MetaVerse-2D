import { Router } from "express";
import { userMiddleware } from "../../middlewares/user";
import { deleteElementInSpace } from "../../controllers/element";


export const elementRouter = Router();


elementRouter.delete("/deleteElement/:elementId",userMiddleware, deleteElementInSpace)