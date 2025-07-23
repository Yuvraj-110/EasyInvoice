import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import businessRoutes from "./routes/businessRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
// import invoiceRoutes from './routes/invoice.js';



dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/invoices", invoiceRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(process.env.PORT || 5000, () => 
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
