import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import MongoStore from "connect-mongo";
dotenv.config();
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

// Define a schema for mosque data
const mosqueSchema = new mongoose.Schema({
  name: String,
  address: String,
  contact: String,
});

// Define a schema for user data
const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  chosenMosqueId: { type: mongoose.Schema.Types.ObjectId, ref: "Mosque" },
  campaigns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
  ],
});

// Define a schema for donation data
const donationSchema = new mongoose.Schema({
  amount: Number,
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mosque: { type: mongoose.Schema.Types.ObjectId, ref: "Mosque" },
  campaign: {type: mongoose.Schema.Types.ObjectId, ref: 'Campaign'},
});

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mosque: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mosque",
  },
  description: {
    type: String,
    required: true,
  },
  goal: {
    type: Number,
    required: true,
  },
  raisedAmount: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  donors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

//not sure what this does
//read below
/*

This plugin simplifies the process of adding password-based authentication using Passport.js.

This is what it does:

Adds fields: It automatically adds a username, a hashed password, and a salt field to the schema to store the credentials securely.
Provides methods: It includes methods like .authenticate(), .serializeUser(), and .deserializeUser() which are essential for handling user login sessions.
Handles hashing: It takes care of hashing passwords and verifying hashed passwords.

*/
userSchema.plugin(passportLocalMongoose);

//registers models
const Mosque = new mongoose.model("Mosque", mosqueSchema);
const User = new mongoose.model("User", userSchema);
const Donation = new mongoose.model("Donation", donationSchema);
const Campaign = new mongoose.model("Campaign", campaignSchema);

//connect passport with user database
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//connect express app
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

/*/ 

ROUTES

/*/

app.get("/api/mosques", async (req, res) => {
  try {
    const mosques = await Mosque.find();
    res.json(mosques);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/mosques", async (req, res) => {
  try {
    const { name, address, contact } = req.body;
    const newMosque = new Mosque({ name, address, contact });
    await newMosque.save();
    res.status(201).json(newMosque);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/mosques/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const mosque = await Mosque.findById(id);
    if (!mosque)
      return res.status(404).json({ msg: "No mosque found with that ID" });
    res.json(mosque);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/api/donations", async (req, res) => {
  if (req.user) {
    try {
      const donations = await Donation.find()
        .populate("donor", "name")
        .populate("mosque", "name");
      res.json(donations);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.post("/api/donations", async (req, res) => {
  if (req.user) {
    try {
      const { amount, donor, mosque, campaign} = req.body;
      const newDonation = new Donation({ amount, donor, mosque, campaign });
      await newDonation.save();

      // Update the campaign's raisedAmount
      await Campaign.findByIdAndUpdate(campaign, {
        $inc: { raisedAmount: amount }, // Increment raisedAmount by the donated amount
        $addToSet: { donors: donor } // Add donor to the donors array if not already present
      });

      res.json(newDonation);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.get("/api/donations/:id", async (req, res) => {
  if (req.user) {
    const id = req.params.id;
    try {
      const donation = await Donation.findById(id)
        .populate("donor", "name")
        .populate("mosque", "name");
      if (!donation)
        return res.status(404).json({ msg: "No donation found with that ID" });
      res.json(donation);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server error" });
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.get("/api/userDonations/:userId", async (req, res) => {
  if (req.user) {
    const userId = req.params.userId;
    try {
      const donations = await Donation.find({ donor: userId })
        .populate("donor", "name")
        .populate("mosque", "name");
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
        .populate("mosque", "name");
      res.json(donations);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server error" });
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.get("/api/users", async (req, res) => {
  if (req.user) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.post("/api/users", async (req, res) => {
  if (req.user) {
    try {
      const { name, email, password } = req.body;
      const newUser = new User({ name, email, password });
      await newUser.save();
      res.json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  if (req.user) {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        chosenMosqueId: req.body.chosenMosqueId,
      });
      req.session.passport.user = updatedUser.username;
      req.login(updatedUser, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: "Error updating session" });
        }

        return res.json({
          message: "User information updated successfully",
          user: updatedUser,
          success: true,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false });
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.get("/api/users/:mosqueId", async (req, res) => {
  if (req.user) {
    try {
      const users = await User.find({chosenMosqueId:req.params.mosqueId});
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
})

app.get("/api/campaigns", async (req, res) => {
  try {
    let campaigns = await Campaign.find();
    return res.json(campaigns);
  } catch (err) {
    return res.status(400).send("Error getting campaigns");
  }
});

app.get("/api/campaigns/:mosqueId", async (req, res) => {
  try {
    let campaigns = await Campaign.find({ mosque: req.params.mosqueId });
    return res.json(campaigns);
  } catch (err) {
    return res.status(400).send("Error getting campaigns");
  }
});

app.post("/api/campaigns", async (req, res) => {
  const { name, mosque, description, goal, startDate, endDate, createdBy } =
    req.body;
  const newCampaign = new Campaign({
    name,
    mosque,
    description,
    goal,
    raisedAmount: 0,
    startDate,
    endDate,
    createdBy,
    donors: [],
  });
  try {
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  const adminPasscode = process.env.PASSCODE; // Retrieve the passcode from environment variables
  const enteredPasscode = req.body.adminPasscode; // The passcode entered by the user
  let isAdmin = false; // Default to false for regular users

  // Check if the entered passcode matches the one stored in environment variables
  if (enteredPasscode && enteredPasscode === adminPasscode) {
    isAdmin = true; // Set isAdmin to true since the passcode is correct
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
          res.json({ success: true });
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
  (req, res) => {
    res.json({
      success: true,
      _id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      chosenMosqueId: req.user.chosenMosqueId,
    });
  }
);

app.get("/api/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      chosenMosqueId: req.user.chosenMosqueId,
    });
  } else {
    res.status(401).send("You need to log in to access this route");
  }
});

app.get("/api/loggedIn", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: req.isAuthenticated(),
      _id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      chosenMosqueId: req.user.chosenMosqueId,
    });
  } else {
    res.json({ success: false });
  }
});

app.get("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ success: true });
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});
