import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// Cloudinary Configuration (should be outside any function)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("Invalid file path.");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File Uploaded Successfully.");
    console.log("File URL on Cloudinary:", response.url);

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    fs.unlinkSync(localFilePath); // Delete the file only if upload fails
    return null;
  }
};

export {uploadOnCloudinary};
