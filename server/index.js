import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import MongoStore from "connect-mongo";
import PDFDocument from "pdfkit";
import fs from "fs";
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
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
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

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  mosque: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mosque",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
});

const replySchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
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
const Announcement = new mongoose.model("Announcement", announcementSchema);
const Reply = new mongoose.model("Reply", replySchema);

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
        .populate("mosque", "name")
        .populate("campaign","name");
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
      const { amount, donor, mosque, campaign } = req.body;
      const newDonation = new Donation({ amount, donor, mosque, campaign });
      await newDonation.save();

      // Update the campaign's raisedAmount
      await Campaign.findByIdAndUpdate(campaign, {
        $inc: { raisedAmount: amount }, // Increment raisedAmount by the donated amount
        $addToSet: { donors: donor }, // Add donor to the donors array if not already present
      });

      res.status(201).json(newDonation);
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

app.get("/api/reports/donations/csv/:mosqueId", async (req, res) => {
  try {
    const donations = await Donation.find({ mosque: req.params.mosqueId })
      .populate("donor", "name")
      .populate("campaign", "name");

    const csvHeader = "Amount,Donor,Campaign\n";

    // Convert donations to CSV format
    const csvRows = donations.map((donation) => {
      return `${donation.amount},${donation.donor.name},${
        donation.campaign?.name || null
      }`;
    });

    const csvData = [csvHeader, ...csvRows].join("\n");

    // Set response headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="donations.csv"'
    );

    // Send the CSV data
    res.send(csvData);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/reports/donations/pdf/:mosqueId", async (req, res) => {
  try {
    const mosque = await Mosque.findById(req.params.mosqueId);
    if (!mosque)
      throw new Error(`Mosque ${req.params.mosqueId} does not exist`);
    const donations = await Donation.find({ mosque: req.params.mosqueId })
      .populate("donor", "name")
      .populate("campaign", "name");
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(`${__dirname}/output.pdf`);
    doc.pipe(stream);
    doc.text(`Donations Report for Mosque: ${mosque.name}`, {
      align: "center",
    });
    donations.forEach((donation) => {
      doc.text(
        `Donor: ${donation.donor.name}, Amount: ${donation.amount}, Campaign: ${
          donation.campaign?.name || null
        }`
      );
    });
    doc.end();
    stream.on("finish", () => {
      res.sendFile(`${__dirname}/output.pdf`);
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/reports/campaigns/csv/:campaignId", async (req, res) => {
  try {
    const donations = await Donation.find({ campaign: req.params.campaignId })
      .populate("donor", "name")
      .populate("campaign", "name")
      .exec();
    const csvHeader = "Amount,Donor\n";
    const csvRows = donations.map((donation) => {
      return `${donation.amount},${donation.donor.name}`;
    });
    const csvData = [csvHeader, ...csvRows].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Campaign_' + campaign.name + '.csv"'
    );
    res.send(csvData);
  } catch (error) {
    console.log(error);
    return res.status(422).send({ message: err.message });
  }
});

app.get("/api/reports/campaigns/pdf/:campaignId", async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.campaignId });
    const donations = await Donation.find({ campaign: req.params.campaignId })
      .populate("donor", "name")
      .populate("campaign", "name")
      .exec();

    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe its output somewhere, like to a file or HTTP response
    // Here we're writing to a file
    const stream = fs.createWriteStream(`${__dirname}/output.pdf`);
    doc.pipe(stream);

    // Add content to the PDF
    doc.text(`Donations Report for Campaign: ${campaign.name}`, {
      align: "center",
    });

    // List donations
    donations.forEach((donation) => {
      doc.text(`Donor: ${donation.donor.name}, Amount: ${donation.amount}`);
    });

    // Finalize PDF file
    doc.end();

    // Wait for the stream to finish to send the file
    stream.on("finish", () => {
      res.sendFile(`${__dirname}/output.pdf`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
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
      // Check if the updated email already exists in the database
      const emailExists = await User.findOne({ email: req.body.updatedUser.email });
      if (emailExists && req.body.updatedUser.email!== req.user.email) {
        return res.json({ message: "That email is already in use", success:false });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          username: req.body.updatedUser.username,
          name: req.body.updatedUser.name,
          email: req.body.updatedUser.email,
          chosenMosqueId: req.body.updatedUser.chosenMosqueId,
        },
        { new: true }
      );
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
      const users = await User.find({ chosenMosqueId: req.params.mosqueId });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

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
    let campaigns = await Campaign.find({ mosque: req.params.mosqueId })
      .populate("createdBy", "name")
      .populate("donors", "name")
      .populate("mosque", "name");
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
    res.status(201).json({ success: true, savedCampaign });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/campaigns/:campaignId", async (req, res) => {
  try {
    let updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.campaignId,
      {
        name: req.body.name,
        description: req.body.description,
        goal: req.body.goal,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      }
    );
    let campaigns = await Campaign.find({ mosque: req.body.mosque._id })
      .populate("createdBy", "name")
      .populate("donors", "name")
      .populate("mosque", "name");
    return res.json({
      message: "Campaign information updated successfully",
      campaigns: campaigns,
      success: true,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e,
    });
  }
});

app.delete("/api/campaigns/:id", async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Campaign.deleteOne({ _id: req.params.id });
      await Donation.deleteMany({ campaign: req.params.id });
      return res.status(200).json({
        message: `Deleted the campaign with id ${req.params.id}`,
        success: true,
      });
    } catch (e) {
      console.log(e);
      return res.json({
        error: e,
      });
    }
  }
});

app.get("/api/announcements/:mosqueId", async (req, res) => {
  try {
    const announcements = await Announcement.find({
      mosque: req.params.mosqueId,
    })
      .populate("mosque", "name")
      .populate("createdBy", "name") // replace 'name' with the actual field name for the user's name
      .populate({
        path: "replies",
        populate: {
          path: "createdBy",
          select: "name", // replace 'name' with the actual field name for the user's name
        },
      });
    res.json({ success: true, announcements: announcements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/announcements", async (req, res) => {
  const { title, content, mosque } = req.body;
  const createdBy = req.user._id; // Assuming user ID is stored in req.user
  try {
    const announcement = await Announcement.create({
      title,
      content,
      createdBy,
      mosque,
    });
    res.status(201).json({ success: true, announcement });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/announcements/:id", async (req, res) => {
  try {
    const replies = await Announcement.findById(req.params.id)
      .select("replies")
      .populate("replies", "name");
    replies.replies.forEach((reply) => {
      Reply.findByIdAndDelete(reply._id);
    });
    const annoucement = await Announcement.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: `Deleted the announcement with id ${req.params.id}`,
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send("Error Occured");
  }
});

app.put("/api/announcements/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
    });
    if (!announcement)
      return res.status(404).json({ notfound: "Announcement not found!" });
    else return res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/replies/:announcementId", async (req, res) => {
  try {
    const replies = await Reply.find({
      announcement: req.params.announcementId,
    })
      .populate("createdBy", "name")
      .sort("createdAt");
    res.json(replies);
  } catch (e) {
    console.log(e);
    res.status(500).json("Server Error");
  }
});

app.post("/api/replies/:announcementId", async (req, res) => {
  try {
    const reply = await Reply.create({
      content: req.body.content,
      createdBy: req.user._id,
    });
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.announcementId,
      { $addToSet: { replies: reply } },
      { new: true }
    );
    res.json({ success: true, announcement, reply });
  } catch (e) {
    console.error(e);
    res.status(400).json({ msg: e });
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
      chosenMosqueName: chosenMosqueName.name,
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
      chosenMosqueName: chosenMosqueName.name,
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
