import express from "express";
import userRoutes from "./userRoute.js";
import roomRoutes from "./roomRoutes.js";
import questionsRoutes from "./questionRoute.js";
import examRoutes from "./examRoutes.js";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/rooms", roomRoutes);
router.use("/questions", questionsRoutes);
router.use("/exam", examRoutes);

export default router;
