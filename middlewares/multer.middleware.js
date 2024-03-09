import multer from "multer";
import fs from "fs";
// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./public/uploads";

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
