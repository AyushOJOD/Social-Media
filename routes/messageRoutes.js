import express from "express";
import { addMessage, getMessages } from "../controllers/messageController.js";
import { isAuthenticated } from "../utils/features.js";

const router = express.Router();

router.post("/addMessage", isAuthenticated, addMessage);
router.get("/getMessages", isAuthenticated, getMessages);

export default router;
