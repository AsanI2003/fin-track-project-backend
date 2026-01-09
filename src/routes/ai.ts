
import express from "express";
import axios from "axios";
import Expense from "../models/Expense";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/chat", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { userMessage } = req.body;

    const expenses = await Expense.find({ user: userId }).lean();

    const summary = expenses.map((e) => ({
      category: e.category,
      amount: e.amount,
      date: e.date.toISOString().split("T")[0], // YYYY-MM-DD format 
    }));

    const summaryString = JSON.stringify(summary);

    // system prompt with explicit instructions
    const systemPrompt = `
You are "FinTrack Pro AI".
You must read the user's transaction history carefully.
Each expense has a category, amount, and date.
When asked about spending based on  in a category or date based on day or month or year,
sum or do whatever user ask  the amounts for that category or date.
If data is missing, just say can't find or not found or something like that.
Politely refuse unrelated questions.
if asking budgeting advice give budgeting advice based on current spendings and  based on user's asking
User transaction history (category, amount, date): ${summaryString}
`;

    
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "groq/compound-mini", // production model, free for developers for now
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ answer: response.data.choices[0].message.content });
  } catch (error: any) {
    console.error("AI chat error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI failed to process request" });
  }
});

export default router;
