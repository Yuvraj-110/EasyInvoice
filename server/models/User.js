import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.model("User", userSchema);
