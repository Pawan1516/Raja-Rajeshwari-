require('dotenv').config();

// Production Crash Protection (Uncaught exception/rejection listeners)
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION AT:', promise, 'REASON:', reason);
});

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Initialize app
const app = express();
app.set('trust proxy', 1); // Configure Express to trust reverse proxy headers

const startServer = async () => {
  // Connect Database
  await connectDB();

  // Middleware
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://raja-rajeshwari-239u.vercel.app',
    'https://raja-rajeshwari.vercel.app'
  ];

  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // Pre-flight for all routes
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Serve Static Uploads Folder (For Local Storage Fallback)
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Define Routes
  app.use('/api/admin', require('./routes/authRoutes'));
  app.use('/api/categories', require('./routes/categoryRoutes'));
  app.use('/api/designs', require('./routes/designRoutes'));
  app.use('/api/team', require('./routes/teamRoutes'));
  app.use('/api/inquiries', require('./routes/inquiryRoutes'));
  app.use('/api/visitors', require('./routes/visitorRoutes'));

  // Serve Frontend Static Files in Production (Frontend is built in ../frontend/dist)
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));

  // Catch-all Route for client-side React SPA routing
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    const indexPath = path.join(distPath, 'index.html');
    if (require('fs').existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.json({ message: 'Welcome to the Raja Rajeshwari Interior Works API! (Frontend build not found)' });
    }
  });

  // Error handling middleware (hardened to prevent internal info leakage)
  app.use((err, req, res, next) => {
    // Log the full stack trace server-side
    console.error('Unhandled Server Error:', err);

    const status = err.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    res.status(status).json({
      error: status === 429 ? 'Too Many Requests' : 'Internal Server Error',
      message: isProduction
        ? 'An unexpected error occurred. Please contact support.'
        : err.message || 'Something went wrong.'
    });
  });

  // Port configuration
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
