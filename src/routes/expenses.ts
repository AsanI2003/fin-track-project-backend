import express from "express";
import Expense from "../models/Expense";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";

const router = express.Router();

// Create 
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { category, amount, date, time } = req.body;
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "category, amount and date are required" });
    }

    const expense = new Expense({
      user: new mongoose.Types.ObjectId(req.userId),
      category,
      amount,
      date: new Date(date),
      time,
    });

    await expense.save();
    res.status(201).json({ expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating expense" });
  }
});

// Get all expenses for logged in user (optionally filter by date)
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { date } = req.query; 

    const filter: any = { user: userId };
    if (date) {
      // match any time on that date
      const d = new Date(String(date));
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      filter.date = { $gte: start, $lte: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    res.json({ expenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching expenses" });
  }
});

// Update expense
router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { category, amount, date, time } = req.body;

    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

    if (category) expense.category = category;
    if (amount !== undefined) expense.amount = amount;
    if (date) expense.date = new Date(date);
    if (time !== undefined) expense.time = time;

    await expense.save();
    res.json({ expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating expense" });
  }
});

// Delete expense
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

   await Expense.findByIdAndDelete(id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting expense" });
  }
});

// Dashboard summary Express route
router.get("/summary", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const now = new Date();

  // Current month boundaries
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Current year boundaries
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31);

  // Fetch all user expenses
  const expenses = await Expense.find({ user: userId });

  // Filter for current month
  const monthlyExpenses = expenses.filter(
    e => e.date >= startOfMonth && e.date <= endOfMonth
  );
  const totalThisMonth = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category (this month only)
  const categoryTotals: Record<string, number> = {};
  monthlyExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  // Group by month (this year only)
  const yearlyExpenses = expenses.filter(
    e => e.date >= startOfYear && e.date <= endOfYear
  );
  const yearlyTotals: Record<string, number> = {};
  yearlyExpenses.forEach(e => {
    const month = new Date(e.date).toLocaleString("default", { month: "short" });
    yearlyTotals[month] = (yearlyTotals[month] || 0) + e.amount;
  });

  res.json({ totalThisMonth, categoryTotals, yearlyTotals });
});


export default router;
