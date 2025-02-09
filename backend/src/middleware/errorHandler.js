exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
};
