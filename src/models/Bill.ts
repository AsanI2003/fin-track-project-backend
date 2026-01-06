
import mongoose, { Schema, Document } from "mongoose";

export interface IBill extends Document {
  user: mongoose.Types.ObjectId;
  imageUrl: string;
  uploadedAt: Date;
}

const BillSchema = new Schema<IBill>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBill>("Bill", BillSchema);
