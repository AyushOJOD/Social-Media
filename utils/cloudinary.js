import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Errorhandler from "../middlewares/error.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (avatar, fileName) => {
  try {
    if (!avatar) return new Errorhandler("Please provide a file", 400);

    // uploading the file on cloudinary

    //  const response =  cloudinary.uploader.upload(
    //     avatar,
    //     { public_id: fileName },
    //     function (error, result) {
    //       console.log(result);
    //     }
    //   );

    const response = cloudinary.uploader.upload_large(
      avatar,
      { resource_type: "image" },
      { public_id: fileName },
      function (error, result) {
        console.log(result, error);
      }
    );

    return response;
  } catch (error) {
    fs.unlinkSync(avatar); // remove the locally saved file

    return new Errorhandler("File upload failed", 500);
  }
};

export { uploadOnCloudinary };
