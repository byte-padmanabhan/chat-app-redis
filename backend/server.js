import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { setupsockets } from "./sockets/index.js";

const pubClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
const app=express()
const server=http.createServer(app)
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const subClient = pubClient.duplicate();
//the above two lines is for intializing
await pubClient.connect();
await subClient.connect();
//the above two is connecting .its like saying connect to this particular redis for listening thihgs
io.adapter(createAdapter(pubClient, subClient));
//so because of the above line your saying that very emit is published and listend by others 
//meaning now your every io.to request is published automatically to the redis
console.log("Redis adapter connected ✅");

setupsockets(io)

app.get("/",(req,res)=>
{
    res.send({message:"hello"})
})
server.listen(8080,()=>
{
    console.log("this server is running on port 8080")
})
