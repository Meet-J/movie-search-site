import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all watchlist routes
router.use(verifyToken);

// @route   GET /api/watchlist
// @desc    Get user's watchlist
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user.watchlist || []);
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching watchlist' });
  }
});

// @route   POST /api/watchlist
// @desc    Toggle movie in user's watchlist
router.post('/', async (req, res) => {
  const movie = req.body;
  if (!movie || !movie.id) {
    return res.status(400).json({ message: 'Invalid movie data' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingIndex = user.watchlist.findIndex((m) => m.id === movie.id);
    if (existingIndex > -1) {
      // Remove movie
      user.watchlist.splice(existingIndex, 1);
    } else {
      // Add movie
      user.watchlist.unshift({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      });
    }

    await user.save();
    return res.json(user.watchlist);
  } catch (err) {
    console.error('Watchlist update error:', err);
    return res.status(500).json({ message: 'Server error updating watchlist' });
  }
});

// @route   POST /api/watchlist/sync
// @desc    Sync local Watchlist array with MongoDB
router.post('/sync', async (req, res) => {
  const { watchlist } = req.body;
  if (!Array.isArray(watchlist)) {
    return res.status(400).json({ message: 'Watchlist must be an array' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Merge unique movies
    const merged = [...user.watchlist];
    watchlist.forEach((localMovie) => {
      if (localMovie && localMovie.id && !merged.some((m) => m.id === localMovie.id)) {
        merged.push({
          id: localMovie.id,
          title: localMovie.title,
          poster_path: localMovie.poster_path,
          vote_average: localMovie.vote_average,
          release_date: localMovie.release_date,
        });
      }
    });

    user.watchlist = merged;
    await user.save();
    return res.json(user.watchlist);
  } catch (err) {
    return res.status(500).json({ message: 'Server error syncing watchlist' });
  }
});

export default router;
