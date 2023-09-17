import express from "express";
import trimRequest from "trim-request";
import { registerAndLoginUser } from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(trimRequest.all, registerAndLoginUser);

export default router;
