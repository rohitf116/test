import express from "express";
import trimRequest from "trim-request";
import {
  createRoom,
  lobby,
  joinRoom,
  exitRoom,
} from "../controllers/roomController.js";
import { isAuthenticated } from "../middlewares/isAuth.js";
const router = express.Router();

router.route("/").post(isAuthenticated, trimRequest.all, createRoom);
router.route("/lobby").get(lobby);
router.route("/join/:roomId").patch(isAuthenticated, trimRequest.all, joinRoom);
router.route("/:roomId").delete(exitRoom);

export default router;
