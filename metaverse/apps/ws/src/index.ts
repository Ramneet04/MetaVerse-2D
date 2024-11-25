const { WebSocketServer } = require("ws");
import { User } from "./user";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", function connection(ws:any){
    console.log("Client connected");
    ws.send("Hello from WebSocket server!");
    let user = new User(ws);
    ws.on("error", console.error);
    ws.on("close", ()=>{
        user?.destroy();
    });
});
console.log("WebSocket server is running on ws://localhost:3001");