import { Router } from "express";


export const router = Router();


router.post("/signup", (req,res)=>{
    res.json({
        message:"signup success",
    })
})

router.post("/signin", (req,res)=>{
    res.json({
        message:"signin success",
    })
})



// router.use("/user", userRouter);