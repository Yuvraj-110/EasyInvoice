import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// 📩 Create new message (from contact form)
router.post("/", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message received!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📩 Get all messages (Admin panel)
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
