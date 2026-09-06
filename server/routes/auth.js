import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      watchlist: [],
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, username: newUser.username },
      process.env.JWT_SECRET || 'super_secret_movie_app_jwt_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        watchlist: newUser.watchlist,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'super_secret_movie_app_jwt_key_2026',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        watchlist: user.watchlist,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching user' });
  }
});

export default router;
