import express from "express";
import Donation from "../models/donation.model.js";
import Campaign from "../models/campaign.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  if (req.user) {
    try {
      const donations = await Donation.find()
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

router.post("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
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

export default router;
