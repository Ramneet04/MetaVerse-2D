import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001});

wss.on("connection", function connection(ws){
    console.log("Client connected");
    ws.on("error", console.error);
    
})