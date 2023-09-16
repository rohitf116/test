import { Schema, model } from "mongoose";

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctOption: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Questions", questionSchema);
