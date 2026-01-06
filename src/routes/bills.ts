// src/routes/bills.ts
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import Bill from "../models/Bill";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload new bill
router.post("/", authMiddleware, upload.single("bill"), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload directly from buffer (simpler than upload_stream)
    const uploaded = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { resource_type: "image" }
    );

    const bill = await Bill.create({
      user: req.userId,
      imageUrl: uploaded.secure_url,
    });

    res.json({ bill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all bills for logged-in user
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const bills = await Bill.find({ user: req.userId }).sort({ uploadedAt: -1 });
    res.json({ bills });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a bill
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const bill = await Bill.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
