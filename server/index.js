import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import passportGoogle from "passport-google-oauth20";
const GoogleStrategy = passportGoogle.Strategy;

import Mosque from "./models/mosque.model.js";
import User from "./models/user.model.js";
import Donation from "./models/donation.model.js";

import mosqueRoutes from "./routes/mosqueRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";

const app = express();
const port = 3000;

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/views"));

app.use(cors({ credentials: true, origin: "http://localhost:8080" }));

app.use(bodyParser.json());

// Use MongoDB as the session store
app.use(
  session({
    secret: "some random and secure value",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // One day
      secure: false, // Change this to true in production
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.URI, // Change this to your MongoDB connection string
      collectionName: "sessions", // Change this to your preferred collection name
    }),
  })
);

//initialise passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to the database
mongoose.connect(process.env.URI).catch((err) => console.log(err));

//connect passport with user database
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) return done(null, existingUser);
      else {
        let user = await User.create({
          username: profile.emails?.[0].value,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          chosenMosqueId: null,
          googleId: profile.id,
        });
        if (user) {
          done(null, user);
        }
      }
    }
  )
);

//connect express app
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use("/api/mosques", mosqueRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/replies", replyRoutes);

app.get("/api/userDonations/:userId", async (req, res) => {
  if (req.user) {
    const userId = req.params.userId;
    try {
      const donations = await Donation.find({ donor: userId })
        .populate("donor", "name")
        .populate("mosque", "name")
        .populate("campaign", "name");
      res.json(donations);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.get("/api/mosqueAllDonations/:mosqueId", async (req, res) => {
  if (req.user) {
    const mosqueId = req.params.mosqueId;
    try {
      const donations = await Donation.find({ mosque: mosqueId })
        .sort([["createdAt", -1]])
        .populate("donor", "name")
        .populate("mosque", "name")
        .populate("campaign", "name");
      res.json(donations);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server error" });
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.post("/api/register", async (req, res) => {
  const adminPasscode = process.env.PASSCODE;
  const enteredPasscode = req.body.adminPasscode;
  let isAdmin = false;

  if (enteredPasscode && enteredPasscode === adminPasscode) {
    isAdmin = true;
  }
  try {
    User.register(
      new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        chosenMosqueId: req.body.chosenMosqueId,
      }),
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.json({ success: false });
        }
        passport.authenticate("local")(req, res, function () {
          res.status(201).json({ success: true });
        });
      }
    );
  } catch (error) {
    res.json({ success: false });
  }
});

app.post(
  "/api/login",
  passport.authenticate("local", { failureMessage: true }),
  async (req, res) => {
    const chosenMosqueName = await Mosque.findById(
      req.user.chosenMosqueId,
      "name"
    );
    res.json({
      success: true,
      _id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      chosenMosqueId: req.user.chosenMosqueId,
      chosenMosqueName: chosenMosqueName.name,
    });
  }
);

app.get("/api/profile", async (req, res) => {
  if (req.isAuthenticated()) {
    const chosenMosqueName = await Mosque.findById(
      req.user.chosenMosqueId,
      "name"
    );
    res.json({
      _id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      chosenMosqueId: req.user.chosenMosqueId,
      chosenMosqueName: chosenMosqueName?.name,
    });
  } else {
    res.status(401).send("You need to log in to access this route");
  }
});

app.get("/api/loggedIn", async (req, res) => {
  if (req.isAuthenticated()) {
    const chosenMosqueName = await Mosque.findById(
      req.user.chosenMosqueId,
      "name"
    );
    res.json({
      success: req.isAuthenticated(),
      _id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      chosenMosqueId: req.user.chosenMosqueId,
      chosenMosqueName: chosenMosqueName?.name,
    });
  } else {
    res.json({ success: false });
  }
});

app.get("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ success: false });
    } else {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ success: false });
        } else {
          res.json({ success: true, message: "Logged out." });
        }
      });
    }
  });
});

app.get(
  "/api/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/api/google/redirect",
  passport.authenticate("google"),
  async (req, res) => {
    return res.redirect("/");
  }
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});
