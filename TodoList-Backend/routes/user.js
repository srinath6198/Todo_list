const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Ensure this line is correct
const User = require('../models/User');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    'your_jwt_secret', // Replace with your secret
    { expiresIn: '1h' }
  );
}

// Route to register a user
router.post('/api/user/register', async (req, res) => { // Correct route path
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Route to login a user
router.post('/api/user/login', async (req, res) => { // Correct route path
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
