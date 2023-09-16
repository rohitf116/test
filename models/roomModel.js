import { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    roomName: {
      type: String,
      required: true,
      unique: true,
    },
    user: [{ type: String, required: true }],
    metadata: [
      {
        user: { type: String, required: true },
        score: { type: Number, default: 0 },
        responses: [
          {
            questionId: { type: String, required: true },
            selectedOption: String,
            correctAnswer: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default model("Room", roomSchema);
