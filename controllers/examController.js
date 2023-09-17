// import examModel from "../models/examModel.js";
import userModel from "../models/userModel.js";
import roomModel from "../models/roomModel.js";
import questionModel from "../models/questionModel.js";

// export const answerQuestion = async (req, res) => {
//   try {
//     const { roomName, userName, questionId, selectedOption } = req.body;

//     // Find the room by roomName
//     const room = await roomModel.findOne({ roomName });

//     if (!room) {
//       return res.status(404).json({
//         success: false,
//         message: "Room not found.",
//       });
//     }

//     // Check if the user is part of the room
//     if (!room.user.includes(userName)) {
//       return res.status(403).json({
//         success: false,
//         message: "User is not part of the room.",
//       });
//     }
//     let oldMetadata = [...room.metadata];

//     // Find the user's metadata entry or create a new one if it doesn't exist
//     let userMetadata = oldMetadata.find((entry) => entry.user === userName);

//     if (!userMetadata) {
//       // Create a new metadata entry for the user
//       userMetadata = {
//         user: userName,
//         responses: [],
//       };
//       oldMetadata.push(userMetadata);
//     }

//     // Find the question by questionId
//     const question = await questionModel.findById(questionId);

//     if (!question) {
//       return res.status(404).json({
//         success: false,
//         message: "Question not found.",
//       });
//     }

//     // Check if the user has already answered this question
//     const existingResponseIndex = userMetadata.responses.findIndex(
//       (response) => response.questionId === questionId
//     );

//     if (existingResponseIndex !== -1) {
//       return res.status(400).json({
//         success: false,
//         message: "User has already answered this question.",
//       });
//     }

//     // Create a new response entry for the question with correctAnswer
//     oldMetadata.responses.push({
//       questionId,
//       selectedOption,
//       correctAnswer: question.correctOption,
//     });

//     console.log(oldMetadata, "   oldMetadata");
//     room.metadata = [oldMetadata];
//     console.log(userMetadata, "          userMetadata");

//     console.log(room.metadata, "          room.metadata");
//     // Save the updated room document
//     await room.save();

//     return res.status(200).json({
//       success: true,
//       message: "Answer saved successfully.",
//       room,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

export const answerQuestion = async (req, res) => {
  try {
    const userId = req.user;
    const { roomId, questionId, selectedOption } = req.body;

    // Find the room by roomName
    const room = await roomModel.findOne({ roomId });

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

    if (!userMetadata) {
      // Create a new metadata entry for the user
      userMetadata = {
        user: userId,
        responses: [],
      };
      room.metadata.push(userMetadata);
    }

    // Find the question by questionId
    const question = await questionModel.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Check if the user has already answered this question
    const existingResponseIndex = userMetadata.responses.findIndex(
      (response) => response.questionId === questionId
    );

    if (existingResponseIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: "User has already answered this question.",
      });
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

export const getUserReport = async (req, res) => {
  try {
    const userId = req.user;
    const roomId = req.params.roomId;

    // Find the room by roomName
    const room = await roomModel.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    // Check if the user is part of the room
    if (!room.user.includes(roomId)) {
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

      // Verify the structure of userMetadata and responses
      console.log("User Metadata:", userMetadata);
      const responses = userMetadata.responses;
      console.log("Responses:", responses);

      // Calculate the user's score
      let score = 0;

      for (const response of responses) {
        const isCorrect = response.selectedOption === response.correctAnswer;

        // Log the question and whether it was correct or not for debugging
        console.log(
          response.questionId,
          response.selectedOption,
          response.correctAnswer
        );

        console.log(`Question: ${response.questionId}, Correct: ${isCorrect}`);

        if (isCorrect) {
          score += 10; // Add 10 points for correct answers
        }
        // Incorrect answers are not awarded any points (score remains the same)
      }

      // Update the user's score in the metadata
      userMetadata.score = score;
      userScores.push({ roomId, score });
    }

    // Save the updated room document
    await room.save();

    // Return the user scores in the response
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
