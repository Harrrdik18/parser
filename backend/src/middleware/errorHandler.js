const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack
    });

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    // Handle XML parsing errors
    if (err.message && err.message.includes('Failed to parse')) {
        return res.status(400).json({
            error: 'XML Parsing Error',
            details: err.message
        });
    }

    // Handle file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            error: 'File too large',
            details: 'Maximum file size is 5MB'
        });
    }

    // Handle mongoose cast errors (e.g., invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid ID',
            details: 'The provided ID is not valid'
        });
    }

    // Handle mongoose duplicate key errors
    if (err.code === 11000) {
        return res.status(400).json({
            error: 'Duplicate Error',
            details: 'A record with this key already exists'
        });
    }

    // Default error
    res.status(500).json({
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

exports.errorHandler = errorHandler;
