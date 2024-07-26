const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Malformed token' });
      }

      const secret = process.env.JWT_SECRET || 'srinath_jwt_secret';
      const decoded = jwt.verify(token, secret);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (error) {
      console.error('Error in authorization middleware:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = authorize;
