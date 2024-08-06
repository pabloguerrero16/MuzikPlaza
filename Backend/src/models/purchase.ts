import mongoose from "mongoose";
import { PurchaseType } from "../shared/types";

const purchaseSchema = new mongoose.Schema<PurchaseType>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
});

const Purchase = mongoose.model<PurchaseType>("Purchase", purchaseSchema);
export default Purchase;
