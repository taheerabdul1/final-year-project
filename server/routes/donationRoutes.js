import express from "express";
import Donation from "../models/donation.model.js";
import Campaign from "../models/campaign.model.js";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51OmluHFSvP9ZwiqBIvzT4twxNnQplSoIZbzunRiOkhXBvUaw5iUMSVCw85mPz81Pdki6VELVavg6fYnM9MwRduks004EbUD8U4"
);

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

router.post("/pay/checkout", async (req, res) => {
  const currentUrl = `${req.protocol}://${req.get("Host")}`;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        adjustable_quantity: {
          enabled: true,
        },
        price_data: {
          unit_amount: req.body.amount * 100,
          currency: "gbp",
          product_data: {
            name: `Donation`,
          },
        },
      },
    ],
    mode: "payment",
    success_url: `${currentUrl}/makeDonation?success=true&amount=${req.body.amount}&campaign=${req.body.campaign}`,
    cancel_url: `${currentUrl}/makeDonation?canceled=true`,
    automatic_tax: { enabled: true },
  });

  res.json({ url: session.url });
});

router.post("/", async (req, res) => {
  if (req.user) {
    try {
      let newDonation;
      if (req.body.campaign) {
        const { amount, donor, mosque, campaign } = req.body;
        newDonation = new Donation({ amount, donor, mosque, campaign });
      } else {
        const { amount, donor, mosque } = req.body;
        newDonation = new Donation({ amount, donor, mosque });
      }
      await newDonation.save();

      // If req.body.campaign exists, update the campaign's raisedAmount
      if (req.body.campaign) {
        await Campaign.findByIdAndUpdate(req.body.campaign, {
          $inc: { raisedAmount: amount }, // Increment raisedAmount by the donated amount
          $addToSet: { donors: donor }, // Add donor to the donors array if not already present
        });
      }

      res.status(201).json({ success: true, newDonation });
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
