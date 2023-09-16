import questionModel from "../models/questionModel.js";
import examModel from "../models/examModel.js";
import userModel from "../models/userModel.js";
// create Room

export const createQuestions = async (req, res) => {
  try {
    const { question, options, answer } = req.body;
    const createdQuestion = await questionModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "A new Question has been Created",
      data: createdQuestion,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "server error", error: error.message });
  }
};

// export const getQuestions = async (req, res) => {
//   try {
//     const roomId = req.params.roomId; // Assuming you want to get roomId from the URL parameter
//     const count = 5;

//     // Check if roomId already exists in any exam object
//     const existingExam = await examModel.findOne({ roomId });

//     if (existingExam) {
//       return res.status(400).json({
//         success: false,
//         message: "Exam with the same roomId already exists",
//       });
//     }

//     // Get 5 random questions
//     const randomQuestions = await questionModel.aggregate([
//       { $sample: { size: count } },
//     ]);

//     // Create a new exam document with the users, room ID, and random question IDs
//     const exam = new examModel({
//       roomId: roomId,
//       questions: randomQuestions.map((question) => question._id), // Extract question IDs
//     });

//     // Save the exam document to the Exam collection
//     await exam.save();

//     // console.log(exam, "......exam");

//     // Format the response as desired
//     return res.status(201).json({
//       success: true,
//       message: "A new Exam has been created",
//       data: {
//         roomId: roomId,
//         questions: randomQuestions,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

export const getQuestions = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const count = 5;

    // Check if roomId already exists in any exam object
    const existingExam = await examModel.findOne({ roomId });

    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: "Exam with the same roomId already exists",
      });
    }

    // Get 5 random questions
    const randomQuestions = await questionModel.aggregate([
      { $sample: { size: count } },
    ]);

    // Create a new exam document with the roomId and random question objects
    const exam = new examModel({
      roomId: roomId,
      questions: randomQuestions,
    });

    // Save the exam document to the Exam collection
    await exam.save();

    return res.status(201).json({
      success: true,
      message: "A new Exam has been created",
      data: {
        roomId: roomId,
        questions: randomQuestions,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getSingleQuestion = async (req, res) => {
  try {
    const examId = req.query.examId;
    const questionIndex = parseInt(req.query.questionIndex);
    const exam = await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (questionIndex < 0 || questionIndex >= exam.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    // Retrieve the question based on the specified index
    const question = exam.questions[questionIndex];

    // Create a new object with only the desired properties
    const responseQuestion = {
      _id: question._id,
      question: question.question,
      options: question.options,
    };

    return res.status(200).json({
      success: true,
      data: responseQuestion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
