// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && user.password === password) { // Replace with hashed password check
    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret');
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = { authenticate };
