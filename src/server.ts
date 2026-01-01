import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/fintrack", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API running"));

app.listen(5000, () => console.log("Server running on port 5000"));
