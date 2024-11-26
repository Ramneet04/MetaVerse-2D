import { Router } from "express";
import { userMiddleware } from "../../middlewares/user";
import { AddElementInSpace, CreateSpace, DeleteSpace, GetAllSpaces, GetSpace } from "../../controllers/space";
import { DeleteElementSchema } from "../../types";
import { Request, Response } from "express";
const client = require("@repo/db/client");

export const spaceRouter = Router();

spaceRouter.post("/",userMiddleware, CreateSpace)

spaceRouter.delete("/:spaceId",userMiddleware, DeleteSpace);

spaceRouter.get("/all",userMiddleware, GetAllSpaces)

spaceRouter.post("/element",userMiddleware, AddElementInSpace)

spaceRouter.get("/:spaceId", userMiddleware, GetSpace);

