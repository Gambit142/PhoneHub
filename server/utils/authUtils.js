const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate JWT token (maintains your existing payload structure)
const generateToken = (user) => {
  return jwt.sign(
    { 
      user: {  // Kept the 'user' wrapper for backward compatibility
        id: user.id,
        role: user.role 
      }
    },
    process.env.JWT_SECRET,
    { expiresIn: '5d' } // Matches your current token expiration
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return null;
  }
};

// Main authentication middleware
const authMiddleware = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded.user; // Maintains your existing structure
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Admin-specific middleware
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      msg: 'Admin privileges required',
      error: 'FORBIDDEN'
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  adminMiddleware
};