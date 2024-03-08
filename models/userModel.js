import mongoose from "mongoose";

// user profile schema
const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  profile_picture_url: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

export const User = new mongoose.model("User", userSchema);
