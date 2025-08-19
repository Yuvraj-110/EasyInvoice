// server/routes/admin.js
import express from "express";
import Invoice from "../models/Invoice.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import Ticket from "../models/Ticket.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const invoices = await Invoice.countDocuments();
    const users = await User.countDocuments();
    const messages = await Message.countDocuments();
    const tickets = await Ticket.countDocuments();

    res.json({ invoices, users, messages, tickets });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Promote
router.put("/users/:id/promote", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = "admin";
    await user.save();

    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to promote user" });
  }
});

// Demote user
router.put("/users/:id/demote", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = "user"; // Demote to regular user
    await user.save();

    res.json({ message: "User demoted to user", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to demote user" });
  }
});


export default router;
