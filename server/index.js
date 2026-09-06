import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import watchlistRoutes from './routes/watchlist.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/movie_search_db';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Movie Search Backend running connected to MongoDB' });
});

// Connect to MongoDB & Start Server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });
