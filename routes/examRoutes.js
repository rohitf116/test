import express from "express";
import trimRequest from "trim-request";
import {
  answerQuestion,
  generateUserReport,
} from "../controllers/examController.js";

const router = express.Router();

router.route("/").post(trimRequest.all, answerQuestion);
router.route("/report").post(generateUserReport);

export default router;
