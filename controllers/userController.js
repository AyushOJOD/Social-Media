import { User } from "../models/userModel.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getUserIdFromCookie } from "../utils/features.js";

export const createProfile = async (req, res, next) => {
  try {
    const { bio } = req.body;

    const userId = getUserIdFromCookie(req);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (bio) {
      user.bio = bio;
    }

    if (req.file) {
      user.profile_picture_url = req.file.path;
    }

    await user.save();

    res.status(200).json({
      message: "User profile created successfully",
      profile_url: user.profile_picture_url,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = getUserIdFromCookie(req);

    const userProfile = await User.findOne({ _id: userId });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const responseData = {
      uuid: userProfile.uuid,
      username: userProfile.username,
      bio: userProfile.bio,
      followers: userProfile.followers.length,
      following: userProfile.following.length,
      profile_picture_url: userProfile.profile_picture_url,
    };

    res.status(200).json({ profile: responseData });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = getUserIdFromCookie(req);
    const { bio, username } = req.body;

    let userProfile = await User.findOne({ _id: userId });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    if (bio) {
      userProfile.bio = bio;
    }

    if (username) {
      userProfile.username = username;
    }

    await userProfile.save();

    res.status(200).json({
      message: "User profile updated successfully",
      profile: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = getUserIdFromCookie(req);

    const user = await User.findOneAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req, res, next) => {
  try {
    const userId = getUserIdFromCookie(req);
    const { followId } = req.params;

    const me = await User.findById(userId);
    const follow = await User.findById(followId);

    console.log(me);
    console.log(follow);

    if (!me || !follow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (me.following.includes(followId)) {
      return res.status(400).json({ message: "Already following" });
    }

    me.following.push(followId);
    follow.followers.push(userId);

    await me.save();
    await follow.save();

    const populatedMe = await User.findById(userId).populate(
      "following",
      "username"
    );
    const populatedFollow = await User.findById(followId).populate(
      "followers",
      "username"
    );

    res.status(200).json({
      message: "User followed successfully",
      populatedMe,
      populatedFollow,
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const userId = getUserIdFromCookie(req);
    const { followId } = req.params;

    const me = await User.findById(userId);
    const follow = await User.findById(followId);

    if (!me || !follow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!me.following.includes(followId)) {
      return res.status(400).json({ message: "Not following" });
    }

    me.following = me.following.filter((id) => id !== followId);

    follow.followers = follow.followers.filter((id) => id !== userId);

    await me.save();
    await follow.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const userId = getUserIdFromCookie(req);

    const user = await User.findById(userId)
      .populate("followers", "username uuid")
      .populate("following", "username uuid");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followers = user.followers;
    const followings = user.following;

    res.status(200).json({ followers, followings });
  } catch (error) {
    next(error);
  }
};
