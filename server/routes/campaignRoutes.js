import express from 'express';
import Campaign from '../models/campaign.model.js';
import Donation from '../models/donation.model.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      let campaigns = await Campaign.find();
      return res.json(campaigns);
    } catch (err) {
      return res.status(400).send("Error getting campaigns");
    }
  });
  
router.get("/:mosqueId", async (req, res) => {
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
  
  router.post("/", async (req, res) => {
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
  
  router.put("/:campaignId", async (req, res) => {
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
  
  router.delete("/:id", async (req, res) => {
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

  export default router;

