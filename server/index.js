import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import http from 'http';
import User from './models/User.js';
import productRoutes from './routes/productRoutes.js';
import SignUpRoutes from './routes/SignUpRoute.js';
import paymentRoutes from './routes/payment.js';
import CartRoutes from './routes/CartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import ContactRoutes from './routes/ContactRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import SubscribeRoutes from './routes/SubscribeRoutes.js';
import MessageRoutes from './routes/MessageRoutes.js';
import DiscountRoutes from './routes/discountRoutes.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// @ts-ignore
import { Strategy as TwitterStrategy } from 'passport-twitter-oauth2';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "*",
    origin: "process.env.REACT_APP", // Your frontend's origin
    methods: ["GET", "POST", 'PUT', 'DELETE'],
    credentials: true,
  },
});

app.use(cors({
  // origin: "*",
  origin: 'process.env.REACT_APP',
  methods: ["GET", "POST", 'PUT', 'DELETE'],
  credentials: true,
}));

// Also add this middleware
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport strategies
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:4000/auth/google/callback",
//   scope: ["profile", "email", "https://www.googleapis.com/auth/user.phonenumbers.read"],
//   passReqToCallback: true,
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     console.log("Google Access Token:", accessToken); // Debugging
//     console.log("Profile Data:", profile); // Debugging

//     const { id: googleId, displayName: name, emails, _json } = profile;
//     const email = emails?.[0]?.value;
    
//     // Fetch phone number
//     const peopleApiUrl = "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers";
//     const { data } = await axios.get(peopleApiUrl, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     console.log("Google People API Response:", data); // Debugging

//     const phoneNumber = data.phoneNumbers?.[0]?.value || "Not Provided";

//     // ✅ Check if user exists, otherwise create a new one
//     let user = await User.findOne({ email: profile.emails[0].value });
//     if (!user) {
//       user = new User({
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         googleId: profile.id,
//         phoneNumber,
//         password: '',
//         addresses: []
//       });
//       await user.save();
//     } else {
//       user.phoneNumber = phoneNumber;
//       await user.save();
//     }

//     return done(null, user);
//   } catch (error) {
//     return done(error, null);
//   }
// }
// ));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || `fbuser${profile.id}@facebook.com`;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        facebookId: profile.id,
        name: profile.displayName,
        email,
        password: 'facebook_user', // Default password
        phoneNumber: profile.phoneNumber, // Can be updated later
        bonusPoints: 0,
        discountCode: null,
        discountExpiresAt: null,
        addresses: [],
      });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.use(new TwitterStrategy({
  clientID: process.env.TWITTER_CONSUMER_KEY,
  clientSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
  scope: ["tweet.read", "users.read", "offline.access"],
  includeEmail: true,
}, async (token, tokenSecret, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || `twitteruser${profile.id}@twitter.com`;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: profile.displayName,
        email: email,
        twitterId: profile.id,
        password: 'twitter_user',
        phoneNumber: profile.phoneNumber,
        bonusPoints: 0,
        discountCode: null,
        discountExpiresAt: null,
        addresses: [],
      });
      await user.save();
    }

    console.log("Twitter user received:", user);
    return done(null, user);
  } catch (error) {
    console.error("Error in Twitter Strategy:", error);
    return done(error, null);
  }
}
));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const PORT = process.env.PORT || 5002;

const __dirname = path.resolve();

// In-memory store for online users
export const onlineUsers = new Map();

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  console.log("Current online users:", Array.from(onlineUsers.entries()));

  // Mark user as online
  socket.on("user-online", (userId) => {
    if (userId) {
      onlineUsers.set(socket.id, userId);
      console.log("User online:", userId);
    } else {
      console.log("Invalid userId received");
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const userId = onlineUsers.get(socket.id);  // Get the userId from the socket.id
    if (userId) {
      onlineUsers.delete(socket.id);  // Remove the socket from the map
      console.log("User disconnected:", userId);
    }
    console.log("Current online users:", Array.from(onlineUsers.entries()));
  });
});

app.use(express.json({ limit: '50mb' }));
app.use(compression());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('build'));
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', SignUpRoutes);
app.use('/api', paymentRoutes);
app.use('/api', CartRoutes);
app.use('/api/users', userRoutes);
app.use('/api', ContactRoutes);
app.use('/api', AdminRoutes);
app.use('/api', SubscribeRoutes);
app.use('/api', MessageRoutes);
app.use('/api', DiscountRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

app.get("/socket.io", (req, res, next) => {
  res.setHeader("Content-Type", "application/javascript");
  next();
});

// Routes for OAuth
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// app.get('/auth/google/callback', passport.authenticate('google', {
//   successRedirect: '/',
//   failureRedirect: '/login',
// }));

// app.get('/auth/facebook', passport.authenticate('facebook'));
// app.get('/auth/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: '/',
//   failureRedirect: '/login',
// }));

// app.get('/auth/twitter', passport.authenticate('twitter'));
// app.get('/auth/twitter/callback', passport.authenticate('twitter', {
//   successRedirect: '/',
//   failureRedirect: '/login',
// }));

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
