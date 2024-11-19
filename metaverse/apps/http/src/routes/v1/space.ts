import { Router } from "express";
import { userMiddleware } from "../../middlewares/user";
import { AddElementInSpace, CreateSpace, DeleteElementInSpace, DeleteSpace, GetAllSpaces, GetSpace } from "../../controllers/space";


export const spaceRouter = Router();

spaceRouter.post("/",userMiddleware, CreateSpace)

spaceRouter.delete("/:spaceId",userMiddleware, DeleteSpace);

spaceRouter.get("/all",userMiddleware, GetAllSpaces)

spaceRouter.post("/element",userMiddleware, AddElementInSpace)

spaceRouter.delete("/element",userMiddleware, DeleteElementInSpace)

spaceRouter.get("/:spaceId", userMiddleware, GetSpace);