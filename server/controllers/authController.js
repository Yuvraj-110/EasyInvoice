import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      verificationToken,
    });

    console.log(`🔔 Created user ${email}, sending verification email...`);

    const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify your EasyInvoice account",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thanks for signing up! Please verify your email by clicking below:</p>
        <a href="${verifyUrl}" style="padding:10px 20px;background:#22c55e;color:white;border-radius:5px;text-decoration:none;">Verify Email</a>
        <p>If you did not create this account, you can ignore this email.</p>
      `
    });

    res.status(201).json({ message: "Account created. Please check your email to verify." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send("Invalid or expired verification token.");

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send("Email verified successfully! You can now login.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email before logging in." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};
