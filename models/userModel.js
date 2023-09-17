import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    joinedRoom: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },

    isReady: {
      type: Boolean,
      default: false,
    },
    metadata: [
      {
        type: Object,
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default model("User", userSchema);
