import { Schema, model } from "mongoose";

const examSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  questions: [
    {
      type: Schema.Types.Mixed,
    },
  ],
});

export default model("Exam", examSchema);
