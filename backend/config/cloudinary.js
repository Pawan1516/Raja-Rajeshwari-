const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
// Tuned for memory-constrained free-tier hosting (Render 512MB RAM limit)
sharp.cache(false);
sharp.concurrency(1);
const crypto = require('crypto');

let isCloudinaryConfigured = false;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  isCloudinaryConfigured = true;
  console.log('✅ Cloudinary Storage Configured Successfully — images will upload to cloud.');
} else {
  console.log('⚠️  Cloudinary credentials missing. Falling back to local WebP file storage under backend/uploads/');
}

// File filter: only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPG, JPEG, PNG, WEBP, GIF)'), false);
  }
};

// Use memoryStorage to process files via sharp before saving
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per file upload limit
});

/**
 * Compresses an image file buffer, converts to WebP, and saves to Cloudinary or Local uploads
 * @param {Object} file - The file object from Multer (memoryStorage)
 * @returns {Promise<string>} - Resolved image URL/path
 */
const processAndUploadImage = async (file) => {
  if (!file || !file.buffer) {
    throw new Error('No file buffer available for processing');
  }

  // Generate unique filename: timestamp + UUID + .webp
  const filename = `${Date.now()}-${crypto.randomUUID()}.webp`;

  try {
    // 1. Process image using sharp: convert to webp, resize to max-width 1024px, quality 65
    const compressedBuffer = await sharp(file.buffer)
      .resize({ width: 1024, withoutEnlargement: true })
      .webp({ quality: 65 })
      .toBuffer();

    if (isCloudinaryConfigured) {
      // 2a. Upload WebP buffer to Cloudinary with timeout protection
      const withTimeout = (promise, ms) => {
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error(`Operation timed out after ${ms}ms`));
          }, ms);
        });
        return Promise.race([
          promise.then((res) => {
            clearTimeout(timeoutId);
            return res;
          }),
          timeoutPromise
        ]);
      };

      const cloudinaryPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'rliw_designs',
            public_id: path.parse(filename).name,
            format: 'webp',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary buffer upload error:', error);
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(compressedBuffer);
      });

      return await withTimeout(cloudinaryPromise, 15000); // 15 seconds timeout limit
    } else {
      // 2b. Save WebP buffer locally
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filepath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filepath, compressedBuffer);
      return `/uploads/${filename}`;
    }
  } catch (err) {
    console.error('Error during image processing:', err);
    throw new Error(`Failed to process and store image: ${err.message}`);
  }
};

module.exports = {
  upload,
  isCloudinaryConfigured,
  processAndUploadImage,
};
