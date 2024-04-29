import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
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

router.put("/:id", async (req, res) => {
  if (req.user) {
    try {
      // Check if the updated email already exists in the database
      const emailExists = await User.findOne({
        email: req.body.updatedUser.email,
      });
      if (emailExists && req.body.updatedUser.email !== req.user.email) {
        return res.json({
          message: "That email is already in use",
          success: false,
        });
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

router.get("/:mosqueId", async (req, res) => {
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

export default router;