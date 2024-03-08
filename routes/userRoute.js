import express from "express";
import {
  createProfile,
  deleteUser,
  followUser,
  getFollowers,
  getProfile,
  unfollowUser,
  updateProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../utils/features.js";

const router = express.Router();

router.put("/createProfile", isAuthenticated, createProfile);
router.get("/getProfile", isAuthenticated, getProfile);
router.patch("/updateProfile", isAuthenticated, updateProfile);
router.delete("/deleteProfile", isAuthenticated, deleteUser);
router.post("/follow/:id", isAuthenticated, followUser);
router.post("/unfollow/:id", isAuthenticated, unfollowUser);
router.post("/getFollowers", isAuthenticated, getFollowers);

export default router;
