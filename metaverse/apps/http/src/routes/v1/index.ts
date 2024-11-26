import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { GetAvailableAvatars, GetAvailableElements, SigninController, SignupController } from "../../controllers/index";
import { elementRouter } from "./element";


export const router = Router();


router.post("/signup", SignupController)

router.post("/signin", SigninController)

router.get("/element", GetAvailableElements)

router.get("/avatars", GetAvailableAvatars)


router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
router.use("/element", elementRouter);