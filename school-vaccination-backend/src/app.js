require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const studentRoutes = require('./routes/students');
const driveRoutes = require('./routes/drives');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGO_URI = 'mongodb+srv://srilakshmikalaga:23101998@cluster0.kyjazba.mongodb.net/school-vaccination?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ MongoDB connected successfully to school-vaccination database'))
.catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('School Vaccination Backend is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});