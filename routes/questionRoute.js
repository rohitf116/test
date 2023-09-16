import express from "express";
import trimRequest from "trim-request";
import {
  createQuestions,
  getQuestions,
  getSingleQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.route("/").post(trimRequest.all, createQuestions);
router.route("/:roomId").get(getQuestions);
router.route("/").get(getSingleQuestion);

export default router;
