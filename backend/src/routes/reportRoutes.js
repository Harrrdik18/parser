const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processXMLReport, getReport, getAllReports } = require('../controllers/reportController');

// Configure multer for XML file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype === 'application/xml' || 
            file.mimetype === 'text/xml' || 
            file.originalname.toLowerCase().endsWith('.xml')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only XML files are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Custom error handling middleware for multer
const uploadMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred during upload
            console.error('Multer error:', err);
            return res.status(400).json({
                error: `File upload error: ${err.message}`
            });
        } else if (err) {
            // An unknown error occurred
            console.error('Upload error:', err);
            return res.status(400).json({
                error: err.message
            });
        }
        // Upload successful, proceed to next middleware
        next();
    });
};

// Routes
router.post('/upload', uploadMiddleware, processXMLReport);
router.get('/:id', getReport);
router.get('/', getAllReports);

module.exports = router;
