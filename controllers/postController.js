import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { getUserIdFromCookie } from "../utils/features.js";
import { v4 as uuidv4 } from "uuid";

export const createPost = async (req, res, next) => {
  try {
    const id = getUserIdFromCookie(req);

    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const postId = uuidv4();

    const post = Post.create({
      uuid: postId,
      creator: id,
      title,
      description,
    });

    res.status(201).json({
      message: "Post created successfully",
      post: {
        uuid: postId,
        creator: id,
        title,
        description,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyPosts = async (req, res, next) => {
  try {
    const id = getUserIdFromCookie(req);

    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const posts = await Post.find({ creator: id });

    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});

    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    await Post.deleteOne({ uuid: postId });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMyFeed = async (req, res, next) => {
  try {
    const id = getUserIdFromCookie(req);

    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = user.following;

    const posts = await Post.find({ creator: { $in: following } })
      .sort({ created_at: -1 })
      .limit(10); // Added rate limiter

    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const id = getUserIdFromCookie(req);

    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { postId } = req.params;

    const post = await Post.findOne({ uuid: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.liked_by.includes(id)) {
      post.liked_by = post.liked_by.filter((user) => user !== id);
      post.likes -= 1;
    } else {
      post.liked_by.push(id);
      post.likes += 1;
    }

    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    next(error);
  }
};
