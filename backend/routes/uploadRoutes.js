import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const uploadRouter = express.Router();

// Get current directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, fileName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to get file stats
const getFileStats = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    };
  } catch (error) {
    return null;
  }
};

// Single image upload
uploadRouter.post('/single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Get file stats
    const fileStats = getFileStats(req.file.path);
    
    // Construct the public URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
        stats: fileStats
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Multiple images upload
uploadRouter.post('/multiple', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const uploadedImages = req.files.map(file => {
      const fileStats = getFileStats(file.path);
      const fileUrl = `${baseUrl}/uploads/${file.filename}`;
      
      return {
        url: fileUrl,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`,
        stats: fileStats
      };
    });

    res.json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      data: uploadedImages
    });

  } catch (error) {
    console.error('Multiple file upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// Delete image
uploadRouter.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        filename: filename,
        deleted: true
      }
    });

  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// Get all uploaded images
uploadRouter.get('/list', async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(uploadsDir, file);
        const fileStats = getFileStats(filePath);
        const fileUrl = `${baseUrl}/uploads/${file}`;
        
        return {
          url: fileUrl,
          filename: file,
          path: `/uploads/${file}`,
          stats: fileStats
        };
      });

    res.json({
      success: true,
      message: `Found ${imageFiles.length} images`,
      data: imageFiles
    });

  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list images',
      error: error.message
    });
  }
});

export default uploadRouter;