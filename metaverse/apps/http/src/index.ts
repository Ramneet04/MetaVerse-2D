import express from "express"
import cors from "cors"
import { router } from "./routes/v1"
const client = require("@repo/db/client");
const app = express()

app.use(express.json());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.use("/api/v1", router);

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is running on port 3000")
})

app.get("/", (req,res)=>{
    res.send("hello");
})