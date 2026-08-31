import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'capstone-properties',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // Resize images for consistent dimensions
    transformation: [{ width: 1600, height: 1200, crop: 'limit' }],
  },
});

// Create multer uploader with 5MB file size limit
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});