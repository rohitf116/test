import express from "express";
import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";
import { Server } from "socket.io";

// dotEnv config {to access the variables}
dotenv.config();

// env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

app.use(express.json());

mongoose
  .connect(DATABASE_URL, { useNewUrlParser: true })

  .then(() => console.log("MongoDb is connected..."))
  .catch((err) => console.log(err));

const server = app.listen(PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});

// Set up Socket.io using the Server class
const io = new Server(server); // Use the Server class to initialize Socket.io
