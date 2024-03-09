import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./data/database.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import cloudinary from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

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

app.use("/", (req, res) => {
  res.send("Welcome to the server");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server started on localhost:${PORT}`);
});

connectDB().catch((err) => console.log(err));
