import express from "express";
import { isAuthenticated } from "../utils/features.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getMyFeed,
  getMyPosts,
  likePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/createPost", isAuthenticated, createPost);
router.get("/getMyPosts", isAuthenticated, getMyPosts);
router.get("/getAllPosts", isAuthenticated, getAllPosts);
router.delete("/deletePost/:id", isAuthenticated, deletePost);
router.get("/getMyFeed", isAuthenticated, getMyFeed);
router.post("/likePost/:id", isAuthenticated, likePost);

export default router;
