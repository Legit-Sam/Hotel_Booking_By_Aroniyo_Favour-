import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Validate Cloudinary configuration
const validateConfig = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary config: ${missing.join(', ')}`);
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  console.log('Cloudinary configured for cloud:', process.env.CLOUDINARY_CLOUD_NAME);
};

validateConfig();

/**
 * Upload a file to Cloudinary with enhanced error handling
 */
export const uploadToCloudinary = async (localFilePath, folder = 'hotel_assets') => {
  if (!localFilePath) {
    console.warn('No file path provided to uploadToCloudinary');
    return null;
  }

  // Verify file exists locally before upload attempt
  if (!fs.existsSync(localFilePath)) {
    console.error(`File not found at path: ${localFilePath}`);
    throw new Error('Local file not found');
  }

  try {
    console.log(`Starting Cloudinary upload for: ${localFilePath}`);
    
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });

    console.log(`Upload successful. Public ID: ${result.public_id}, URL: ${result.secure_url}`);

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes
    };
  } catch (err) {
    console.error('Cloudinary Upload Error:', {
      error: err.message,
      path: localFilePath,
      folder,
      stack: err.stack
    });
    throw err;
  }
};

/**
 * Delete image with retry logic
 */
export const deleteFromCloudinary = async (publicId, options = {}) => {
  if (!publicId) {
    console.warn('No public_id provided for deletion');
    return;
  }

  const maxRetries = options.retries || 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      attempts++;
      console.log(`Attempt ${attempts} to delete: ${publicId}`);
      
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        console.log(`Successfully deleted: ${publicId}`);
        return;
      }
      
      console.warn(`Unexpected deletion result for ${publicId}:`, result);
    } catch (err) {
      console.error(`Delete attempt ${attempts} failed:`, err.message);
      if (attempts >= maxRetries) {
        throw new Error(`Failed to delete after ${maxRetries} attempts: ${err.message}`);
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
};