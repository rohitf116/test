import express from "express";
import trimRequest from "trim-request";
import {
  createQuestions,
  getQuestions,
  getSingleQuestion,
} from "../controllers/questionController.js";
import { isAuthenticated } from "../middlewares/isAuth.js";

const router = express.Router();

router.route("/").post(trimRequest.all, createQuestions);

router.route("/:roomId").get(isAuthenticated, getQuestions);
router.route("/").get(isAuthenticated, getSingleQuestion);

export default router;
