import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Errorhandler from "../middlewares/error.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return new Errorhandler("Please provide a file", 400);

    // uploading the file on cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(response.url);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved file

    return new Errorhandler("File upload failed", 500);
  }
};

export { uploadOnCloudinary };
