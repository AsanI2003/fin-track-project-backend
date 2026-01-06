import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";
import { authMiddleware } from "./middleware/authMiddleware";
import expensesRoutes from "./routes/expenses";
import billsRoutes from "./routes/bills"
import dotenv from "dotenv";
dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/bills",billsRoutes);


app.get("/", (req, res) => res.send("API running"));

app.listen(process.env.PORT!, () => console.log("Server running"));
