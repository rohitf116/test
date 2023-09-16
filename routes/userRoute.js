import express from "express";
import trimRequest from "trim-request";
import { registerOrLoginUser } from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(trimRequest.all, registerOrLoginUser);
// router.route("/login").post(trimRequest.all, userLogin);

export default router;
