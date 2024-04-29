import express from "express";
import Reply from "../models/reply.model.js";
import Announcement from "../models/announcement.model.js";

const router = express.Router();

router.get("/:announcementId", async (req, res) => {
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

router.post("/:announcementId", async (req, res) => {
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

export default router;
