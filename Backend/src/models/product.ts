import mongoose from "mongoose";
import { ProductType } from "../shared/types";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
  ],
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
  format: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
});

const Product = mongoose.model<ProductType>("Product", productSchema);
export default Product;
