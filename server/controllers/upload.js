import express from 'express';
const router = express.Router();
import cloudinary from "../config/cloudinary.js"; // Note the .js extension
import upload from "../middleware/multer.js"; // Note the .js extension
import fs from 'fs/promises'; // Import the fs promises module

router.post('/upload', upload.single('image'), async function (req, res) {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    // After successful upload, delete the local file
    await fs.unlink(req.file.path);

    res.status(200).json({
      public_id: result.public_id,
      url: result.url
    });
  } catch (err) {
    console.error(err);

    // Optionally delete the file if an error occurred during upload
    if (req.file && req.file.path) {
       await fs.unlink(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Error uploading image" // More descriptive message
    });
  }
});

export default router;