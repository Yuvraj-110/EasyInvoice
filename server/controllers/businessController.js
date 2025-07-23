import fs from 'fs';
import path from 'path';
import Business from '../models/businessModel.js';

export const createBusiness = async (req, res) => {
  try {
    const { name, taxId, businessType, address, phone, website, currency } = req.body;

    const newBusiness = new Business({
      user: req.user._id,
      name,
      taxId,
      businessType,
      address,
      phone,
      website,
      currency,
      logoUrl: req.file ? `/uploads/${req.file.filename}` : ""
    });

    await newBusiness.save();
    res.status(201).json(newBusiness);
  } catch (err) {
    console.error("Failed to create business:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ user: req.user._id });
    res.json(businesses);
  } catch (err) {
    console.error("Failed to get businesses:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (business.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (business.logoUrl) {
      const logoPath = path.join(path.resolve(), business.logoUrl);
      fs.unlink(logoPath, (err) => {
        if (err) console.error("Failed to delete logo file:", err);
      });
    }

    await business.deleteOne();
    res.json({ message: "Business deleted successfully" });

  } catch (err) {
    console.error("Failed to delete business:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findOne({ _id: req.params.id, user: req.user._id });
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.json(business);
  } catch (err) {
    console.error("Failed to get business by id:", err);
    res.status(500).json({ message: "Server error" });
  }
};