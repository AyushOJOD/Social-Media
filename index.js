import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./data/database.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import messageRoutes from "./routes/messageRoutes.js";
import cloudinary from "cloudinary";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/message", messageRoutes);

app.use("/", (req, res) => {
  res.send("Welcome to the server");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server started on localhost:${PORT}`);
});

connectDB().catch((err) => console.log(err));

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
