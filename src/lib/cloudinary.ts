import { v2 as cloudinary } from "cloudinary";

// Use verified credentials directly so Render environment typos or missing vars never cause signature mismatch
const CLOUD_NAME = (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== "your-cloud-name")
  ? process.env.CLOUDINARY_CLOUD_NAME.trim().replace(/^["']|["']$/g, "")
  : "r4w4fqt7";

const API_KEY = (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== "your-api-key")
  ? process.env.CLOUDINARY_API_KEY.trim().replace(/^["']|["']$/g, "")
  : "884492317541324";

const API_SECRET = "f-CvoL3G6FPAQ1zblyPI3PuaEzE";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

export default cloudinary;