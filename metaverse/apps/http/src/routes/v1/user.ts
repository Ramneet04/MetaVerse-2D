import { Router } from "express";
import { OthersMetadataController, UpdateMetadataController} from "../../controllers/user";
import { userMiddleware } from "../../middlewares/user";
const client = require("@repo/db/client");
export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, UpdateMetadataController)
userRouter.get("/metadata/bulk", OthersMetadataController)