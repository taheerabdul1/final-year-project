import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Donation from "../models/donation.model.js";
import Campaign from "../models/campaign.model.js";
import Mosque from "../models/mosque.model.js";
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
  const mosque = await Mosque.findOne({_id:req.user.chosenMosqueId});
  const environment = process.env.NODE_ENV;
  let currentUrl;
  if (environment=="DEVELOPMENT"){
    currentUrl = `http://localhost:8080`
  } else {
    currentUrl = `${req.protocol}://${req.get("Host")}`;
  }
  let successUrl = `${currentUrl}/donationSuccess?session_id={CHECKOUT_SESSION_ID}&amount=${req.body.amount}&campaign=${req.body.campaign}`;
  let cancelUrl= `${currentUrl}/makeDonation?canceled=true`;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        price_data: {
          unit_amount: req.body.amount * 100,
          currency: "gbp",
          product_data: {
            name: req.body.campaign? `${mosque.name} - ${req.body.campaign}` : mosque.name,
          },
        },
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    automatic_tax: { enabled: true },
  });
  res.json({ url: session.url });
});

router.get("/pay/checkout", async (req, res) => {
  try{
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    return res.json({session});
  } catch (e) {
    return res.status(400).json({success:false})
  }
})

router.post("/", async (req, res) => {
  if (req.user) {
    try {
      const { amount, donor, mosque, campaign } = req.body;
      let newDonation = new Donation({ amount, donor, mosque, campaign });
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
