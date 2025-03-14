import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

type Message = {
  message: string;
  username: string;
};

io.on("connection", (socket) => {
  console.log("A user is connected.");

  io.emit("join noti", { message: "Someone joined the room." });

  socket.on("send message", ({ message, username }: Message) => {
    io.emit("send message", { message, username });
  });

  socket.on("disconnect", () => {
    console.log("A user is disconnected.");

    io.emit("leave noti", { message: "Someone leaved the room." });
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on PORT : 3000");
});
