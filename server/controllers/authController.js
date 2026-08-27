const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route  POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const safeEmail = typeof email === 'string' ? email.trim() : '';

    const existingUser = await User.findOne({ email: safeEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: safeEmail,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    req.log.info({ userId: user._id }, 'New user signed up');

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    req.log.error(error, 'Signup failed');
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// @route  POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const safeEmail = typeof email === 'string' ? email.trim() : '';

    const user = await User.findOne({ email: safeEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    req.log.info({ userId: user._id }, 'User logged in');

    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    req.log.error(error, 'Login failed');
    res.status(500).json({ message: 'Server error during login' });
  }
};

const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024; // 1MB

// @route  PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'Name cannot be empty' });
      }
      user.name = name.trim();
    }

    if (profilePicture !== undefined) {
      if (profilePicture !== null) {
        if (typeof profilePicture !== 'string') {
          return res.status(400).json({ message: 'Profile picture must be a valid data URL string' });
        }

        const matches = profilePicture.match(/^data:image\/[a-zA-Z0-9\+\-\.]+;base64,(.+)$/);
        if (!matches || matches.length < 2) {
          return res.status(400).json({ message: 'Invalid image data URL format' });
        }

        const base64Data = matches[1];

        // Check for valid base64 characters
        if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
          return res.status(400).json({ message: 'Malformed Base64 image payload' });
        }

        // Account for trailing Base64 padding
        let paddingCount = 0;
        if (base64Data.endsWith('==')) {
          paddingCount = 2;
        } else if (base64Data.endsWith('=')) {
          paddingCount = 1;
        }

        const sizeInBytes = Math.floor((base64Data.length * 3) / 4) - paddingCount;

        if (sizeInBytes > MAX_IMAGE_SIZE_BYTES) {
          return res.status(400).json({ message: 'Profile picture must be under 1MB' });
        }
      }
      user.profilePicture = profilePicture;
    }

    const updatedUser = await user.save();

    req.log.info({ userId: updatedUser._id }, 'Profile updated');

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    req.log.error(error, 'Failed to update profile');
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// @route  GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    req.log.error(error, 'Failed to fetch profile');
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

module.exports = { signup, login, updateProfile, getProfile };