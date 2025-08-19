import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  message: { type: String, required: true },
  sender: { type: String, enum: ["user", "admin"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    priority: { 
      type: String, 
      enum: ["Low", "Medium", "High"], 
      default: "Medium" 
    },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Open", "In Progress", "Closed"], 
      default: "Open"
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
