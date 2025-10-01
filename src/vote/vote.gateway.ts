// socket.ts
import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

let io: Server;

export function initSocket(port: number) {
  const app = express();
  const httpServer = createServer(app);

  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    socket.on("vote", (data) => {
      io.emit("voteCreated", data);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Socket.IO listening on ${port}`);
  });
}

export function getIoInstance() {
  return io;
}
