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
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/createPost",
  isAuthenticated,
  upload.single("post_url"),
  createPost
);
router.get("/getMyPosts", isAuthenticated, getMyPosts);
router.get("/getAllPosts", isAuthenticated, getAllPosts);
router.delete("/deletePost/:id", isAuthenticated, deletePost);
router.get("/getMyFeed", isAuthenticated, getMyFeed);
router.post("/likePost/:id", isAuthenticated, likePost);

export default router;
