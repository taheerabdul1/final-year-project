import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
import session from "express-session"
import passport from "passport"
import passportLocalMongoose from "passport-local-mongoose"
import MongoStore from "connect-mongo"
dotenv.config();
const app = express();
const port = 3000;

//test

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
});

// Define a schema for donation data
const donationSchema = new mongoose.Schema({
  amount: Number,
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mosque: { type: mongoose.Schema.Types.ObjectId, ref: "Mosque" },
});

//not sure what this does
userSchema.plugin(passportLocalMongoose);

//registers models
const Mosque = new mongoose.model("Mosque", mosqueSchema);
const User = new mongoose.model("User", userSchema);
const Donation = new mongoose.model("Donation", donationSchema);

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

app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name")
      .populate("mosque", "name");
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/donations", async (req, res) => {
  try {
    const { amount, donor, mosque } = req.body;
    const newDonation = new Donation({ amount, donor, mosque });
    await newDonation.save();
    res.json(newDonation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/donations/:id", async (req, res) => {
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
});

app.get("/api/mosqueAllDonations/:mosqueId", async (req, res) => {
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
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
    });
    req.session.passport.user = updatedUser.username;
    req.login(updatedUser, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ error: "Error updating session" });
      }

      return res.json({
        message: "User information updated successfully",
        user: updatedUser,
        success: true
      });
    });
    //res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false });
  }
});

app.post("/api/register", async (req, res) => {
  try{
    User.register(
      new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
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
    res.json({success:false})
  }
});

app.post("/api/login", passport.authenticate("local", {failureMessage: true}), (req, res) => {
  res.json({
    success: true,
    _id: req.user._id,
    username: req.user.username,
    name: req.user.name,
    email: req.user.email,
  });
});

app.get("/api/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
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
