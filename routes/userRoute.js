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
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.put(
  "/createProfile",
  upload.single("profile_picture_url"),
  createProfile
);
router.get("/getProfile", isAuthenticated, getProfile);
router.patch(
  "/updateProfile",
  upload.single("profile_picture_url"),
  isAuthenticated,
  updateProfile
);
router.delete("/deleteProfile", isAuthenticated, deleteUser);
router.post("/follow/:followId", isAuthenticated, followUser);
router.post("/unfollow/:id", isAuthenticated, unfollowUser);
router.get("/getFollowers", isAuthenticated, getFollowers);

export default router;
