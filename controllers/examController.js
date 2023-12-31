import roomModel from "../models/roomModel.js";
import questionModel from "../models/questionModel.js";
import { isValid, isValidObjectId } from "../utils/regex.js";

// Answer questions

export const answerQuestion = async (req, res) => {
  try {
    const userId = req.user;
    const { roomId, questionId, selectedOption } = req.body;
    if (!Object.keys(req.body).length) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!isValid(selectedOption)) {
      return res
        .status(400)
        .json({ success: false, message: "Please select option" });
    }

    if (!isValidObjectId(questionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid questionId" });
    }

    if (!isValidObjectId(roomId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid roomId" });
    }

    // Find the room by roomName
    const room = await roomModel.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    // Check if the user is part of the room

    if (!room.user.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "User is not part of the room.",
      });
    }

    // Find the user's metadata entry or create a new one if it doesn't exist
    let userMetadata = room.metadata.find((entry) => entry.user === userId);

    const question = await questionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    if (!userMetadata) {
      // Create a new metadata entry for the user
      userMetadata = {
        user: userId,
        responses: [
          {
            questionId,
            selectedOption,
            correctAnswer: question.correctOption,
          },
        ],
      };
      room.metadata.push(userMetadata);
    }

    // Create a new response entry for the question with correctAnswer
    userMetadata.responses.push({
      questionId,
      selectedOption,
      correctAnswer: question.correctOption,
    });

    // Save the updated room document
    await room.save();

    return res.status(200).json({
      success: true,
      message: "Answer saved successfully.",
      room,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get result

export const getUserReport = async (req, res) => {
  try {
    const userId = req.user;
    const roomId = req.params.roomId;

    if (!isValidObjectId(roomId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid roomId" });
    }

    const room = await roomModel.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    if (!room.user.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized, User is not part of the room.",
      });
    }

    const userScores = [];

    for (const userName of room.user) {
      const userMetadata = room.metadata.find(
        (metadata) => metadata.user === userName
      );

      if (!userMetadata) {
        return res.status(404).json({
          success: false,
          message: "User metadata not found for " + userName,
        });
      }

      // Calculate the user's score
      let score = 0;

      for (const response of userMetadata.responses) {
        const question = await questionModel.findById(response.questionId);

        if (!question) {
          return res.status(404).json({
            success: false,
            message: "Question not found for ID: " + response.questionId,
          });
        }

        const isCorrect = response.selectedOption === question.correctOption;

        if (isCorrect) {
          score += 10; // Add 10 points for correct answers
        }
      }

      userMetadata.score = score;
      userScores.push({ user: userName, score });
    }

    // await room.save();

    return res.status(200).json({
      success: true,
      userScores: userScores,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
