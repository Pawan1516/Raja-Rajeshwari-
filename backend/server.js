require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Initialize app
const app = express();

const startServer = async () => {
  // Connect Database
  await connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve Static Uploads Folder (For Local Storage Fallback)
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Define Routes
  app.use('/api/admin', require('./routes/authRoutes'));
  app.use('/api/categories', require('./routes/categoryRoutes'));
  app.use('/api/designs', require('./routes/designRoutes'));
  app.use('/api/team', require('./routes/teamRoutes'));
  app.use('/api/inquiries', require('./routes/inquiryRoutes'));

  // Root Route
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Raja Rajeshwari Interior Works API!' });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: err.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  });

  // Port configuration
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
