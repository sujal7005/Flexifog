import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  console.log("Auth headers:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log("Token received:", token.substring(0, 20) + "...");

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      console.log("User found:", req.user ? req.user._id : "No user");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error.name, error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          expiredAt: error.expiredAt
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
  } else {
    console.log("No Bearer token in headers");
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

export const admin = (req, res, next) => {
  console.log("Checking admin status:", req.user ? req.user.isAdmin : "No user");
  
  const adminEmails = ['sujal0705gupta@gmail.com', 'admin@example.com'];

  if (req.user && (req.user.isAdmin || adminEmails.includes(req.user.email))) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as an admin'
    });
  }
};