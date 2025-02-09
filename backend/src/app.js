require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errorHandler } = require('./middleware/errorHandler');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both CRA and Vite default ports
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pre-flight requests
app.options('*', cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creditsea', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
