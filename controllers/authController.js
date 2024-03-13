import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import { v4 as uuidv4 } from "uuid";

export const register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      res.json({
        success: false,
        message: "Invalid email",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      res.json({
        success: false,
        message: "User already exists",
      });
    } else {
      const userId = uuidv4();

      const hashedPassword = await bcrypt.hash(password, 10);

      let user = await User.create({
        uuid: userId,
        username,
        password: hashedPassword,
        email,
      });

      sendCookie(user, res, "User registered successfully", 201);
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res
          .json({
            success: false,
            message: "Invalid credentials",
          })
          .status(201);
      } else {
        sendCookie(user, res, "User logged in successfully", 200);
      }
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
