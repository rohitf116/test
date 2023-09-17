import express from "express";
import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);
// dotEnv config {to access the variables}
dotenv.config();

io.on("connection", (socket) => {
  console.log("a user is connected", socket.id);

  socket.on("disconnect", () => {
    console.log("a user is disconnected");
  });
});

// env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

app.use(express.json());

mongoose
  .connect(DATABASE_URL, { useNewUrlParser: true })
  .then(() => console.log("MongoDb is connected..."))
  .catch((err) => console.log(err));

server.listen(PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
