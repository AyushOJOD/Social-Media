import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import { isAuthenticated } from "../utils/features.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

export default router;
