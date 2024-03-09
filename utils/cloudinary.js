import { v2 as cloudinary } from "cloudinary";

const uploadFile = async (base64String) => {
  try {
    const result = await cloudinary.uploader.upload(
      "data:image/jpeg;base64," + base64String
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export default uploadFile;
