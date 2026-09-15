import { v2 as cloudinary } from "cloudinary";

const clean = (val?: string) => (val || "").trim().replace(/^["']|["']$/g, "").trim();

cloudinary.config({
  cloud_name: clean(process.env.CLOUDINARY_CLOUD_NAME) || "r4w4fqt7",
  api_key: clean(process.env.CLOUDINARY_API_KEY) || "884492317541324",
  api_secret: clean(process.env.CLOUDINARY_API_SECRET) || "f-CvoL3G6FPAQ1zblyPI3PuaEzE",
  secure: true,
});

export default cloudinary;