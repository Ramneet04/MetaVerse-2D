import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001});

wss.on("connection", function connection(ws){
    ws.on("error", console.error);
    ws.on("message", function message(data){
        console.log(`Received message => ${data}`)
    })
    ws.send("something");
})