import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninController, SignupController } from "../../controllers/index";


export const router = Router();


router.post("/signup", SignupController)
router.post("/signin", SigninController)

router.get("/element",)

router.get("/avatars",)


router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);