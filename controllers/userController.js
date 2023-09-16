import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { HASHTOKEN } = process.env;

export const registerOrLoginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const existingUser = await userModel
      .findOne({ userName })
      .select("+password");

    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: existingUser._id },
        HASHTOKEN,
        { expiresIn: "1h" } // Token expiration time
      );

      const userDetails = {
        userName: existingUser.userName,
        userId: existingUser._id,
        metadata: existingUser.metadata,
      };

      return res.status(200).json({
        success: true,
        message: "You have successfully logged in!",
        data: { userDetails, token },
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = { userName, password: hashedPassword };

      const createdUser = await userModel.create(userData);
      const userDetails = {
        userName: createdUser.userName,
        userId: createdUser._id,
        metadata: createdUser.metadata,
      };

      // Generate a JWT token for the newly registered user
      const token = jwt.sign({ userId: createdUser._id }, HASHTOKEN, {
        expiresIn: "1h",
      });

      return res.status(201).json({
        success: true,
        message: "A new user has been created and logged in",
        data: { userDetails, token },
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
