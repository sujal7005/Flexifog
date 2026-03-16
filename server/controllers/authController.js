import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Google sign-in handler
export const googleSignin = async (req, res) => {
  console.log("Received Google Sign-In request:", req.body);
  const { idToken } = req.body; // Only expect idToken, not accessToken

  // Generate random discount code
  const generateDiscountCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "WELCOME-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  if (!idToken) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing credentials - idToken is required" 
    });
  }

  try {
    console.log("Verifying token...");
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("Token verified!");
    const payload = ticket.getPayload();
    console.log("Decoded Payload:", payload);
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists in your database
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not found, creating new user...");

      // Generate discount code and expiration date
      const discountCode = generateDiscountCode();
      const discountExpiresAt = new Date();
      discountExpiresAt.setDate(discountExpiresAt.getDate() + 7); // Expires in 7 days

      user = new User({ 
        googleId,
        name, 
        email, 
        password: await bcrypt.hash(googleId, 10), // Hash the googleId as password
        phoneNumber: '', // Will need to be filled later
        profilePicture: picture,
        discountCode,
        discountExpiresAt,
        isEmailVerified: true, // Google emails are verified
      });
      await user.save();
    } else {
      console.log("User exists, logging in...");
      // Update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = picture || user.profilePicture;
        await user.save();
      }
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userData = user.toObject();
    delete userData.password;

    res.json({ 
      success: true, 
      user: userData, 
      token 
    });
    
  } catch (error) {
    console.error("Google sign-in error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Google sign-in failed", 
      error: error.message 
    });
  }
};

// Facebook sign-in handler
export const facebookSignin = async (req, res) => {
  const { accessToken } = req.body; // Extract Facebook access token

  if (!accessToken) {
    return res.status(400).json({ success: false, message: "Access token is required" });
  }

  // Generate appsecret_proof
  const appSecret = process.env.FACEBOOK_CLIENT_SECRET; // Make sure this is in your .env file
  const appsecret_proof = crypto
    .createHmac("sha256", appSecret)
    .update(accessToken)
    .digest("hex");

  // Generate random discount code
  const generateDiscountCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "WELCOME-";

    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return code;
  };
  
  try {
    // Verify accessToken with Facebook API
    const fbResponse = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture&appsecret_proof=${appsecret_proof}`);
    const { id, name, email } = fbResponse.data;
    const phoneNumber = fbResponse.data.phoneNumbers?.[0]?.value || "Not Provided";

    let user = await User.findOne({ email });

    if (!user) {
      // Generate discount code and expiration date
      const discountCode = generateDiscountCode();
      const discountExpiresAt = new Date();
      discountExpiresAt.setDate(discountExpiresAt.getDate() + 7); // Expires in 7 days

      user = new User({
        facebookId: id,
        name,
        email: email || `fbuser${id}@facebook.com`,
        password: 'facebook_user', // Default password
        phoneNumber,
        bonusPoints: 0,
        discountCode,
        discountExpiresAt,
        addresses: [],
      });
      await user.save();
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, user, token });
  } catch (error) {
    console.error("Facebook Sign-in Error:", error);
    res.status(500).json({ success: false, message: 'Facebook sign-in failed' });
  }
};

// Twitter sign-in handler
export const twitterSignin = async (req, res) => {
  const { oauth_token, oauth_token_secret } = req.body; // Extract tokens

  if (!oauth_token || !oauth_token_secret) {
    return res.status(400).json({ success: false, message: "Missing OAuth tokens" });
  }

  try {
    passport.authenticate("twitter", async (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({ success: false, message: "Twitter authentication failed" });
      }

      // Generate JWT for authenticated user
      const token = jwt.sign(
        { id: user.id, name: user.displayName, twitterId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        success: true,
        message: "Twitter sign-in successful",
        user: {
          id: user.id,
          name: user.displayName,
          username: user.username,
          email: user.email,
        },
        token,
      });
    })(req, res);
  } catch (error) {
    console.error("Twitter sign-in error:", error);
    res.status(500).json({ success: false, message: "Twitter sign-in failed" });
  }
};  