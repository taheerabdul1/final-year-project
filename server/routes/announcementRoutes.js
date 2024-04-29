import express from "express";
import Announcement from "../models/announcement.model.js";
import Reply from "../models/reply.model.js";

const router = express.Router();

router.get("/:mosqueId", async (req, res) => {
  try {
    const announcements = await Announcement.find({
      mosque: req.params.mosqueId,
    })
      .populate("mosque", "name")
      .populate("createdBy", "name") 
      .populate({
        path: "replies",
        populate: {
          path: "createdBy",
          select: "name", 
        },
      });
    res.json({ success: true, announcements: announcements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { title, content, mosque } = req.body;
  const createdBy = req.user._id; 
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

router.delete("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

export default router;
