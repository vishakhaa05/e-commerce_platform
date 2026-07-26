import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import categoryRoutes from './routes/category.js';
import orderRoutes from './routes/order.js';
import wishlistRoutes from './routes/wishlist.js';
import couponRoutes from './routes/coupon.js';
import reviewRoutes from './routes/review.js';
import paymentRoutes from './routes/payment.js';
import analyticsRoutes from './routes/analytics.js';
// Import middlewares
import { errorHandler } from './middleware/error.js';
dotenv.config({ override: true });
const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;
// Security Middlewares
app.use(helmet({
    crossOriginResourcePolicy: false, // allows serving images locally if needed
}));
// CORS Configuration
const frontendUrl = process.env.FRONTEND_URL || 'https://e-commerce-platform-ggle.vercel.app';
const cleanFrontendUrl = frontendUrl.replace(/\/+$/, '');
const allowedOrigins = [
  cleanFrontendUrl,
  `${cleanFrontendUrl}/`,
  'https://e-commerce-platform-ggle.vercel.app',
  'https://e-commerce-platform-ggle.vercel.app/',
  'https://e-commerce-platform-llu4.vercel.app',
  'https://e-commerce-platform-llu4.vercel.app/',
  'http://localhost:8080',
  'http://localhost:8080/',
  'http://localhost:5173',
  'http://localhost:5173/'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`[CORS Blocked] Request from origin "${origin}" was blocked. Allowed origins:`, allowedOrigins);
      return callback(null, false); // Block origin but don't crash server
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// Body Parsers
app.use(express.json());
app.use(cookieParser());
// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
});
app.use('/api', limiter);
// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'BigMarket API is running.' });
});
// Global Error Handler Middleware
app.use(errorHandler);
// Database Connection & Server Startup
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bigmarket';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Time out after 5 seconds instead of hanging
        });
        console.log('MongoDB connected successfully.');
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    }
    catch (error) {
    console.error("DATABASE CONNECTION ERROR");
    console.error(error);
    process.exit(1);
}
};
connectDB();
