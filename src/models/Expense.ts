
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExpense extends Document {
  user: Types.ObjectId;
  category: string;
  amount: number;
  date: Date;
  time?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: [
        "Food & Groceries",
        "Housing & Utilities",
        "Transportation",
        "Healthcare",
        "Debt/Loans",
        "Savings/Investments",
        "Miscellaneous",
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    time: { type: String }, // optional HH:MM string
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
