import mongoose from "mongoose";

// User
export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  rol: string;
};

// Genre
export type GenreType = {
  _id: string;
  name: string;
};

// Artist
export type ArtistType = {
  _id: string;
  name: string;
};

// Product
export type ProductType = {
  _id: string;
  name: string;
  genre: string[]; //mongoose.Schema.Types.ObjectId[];
  artist: string; //mongoose.Schema.Types.ObjectId;
  format: string;
  releaseDate: Date;
  price: number;
  description: string;
  stock: number;
  imageUrls: string[];
  lastUpdated: Date;
};

// Purchase
export type PurchaseType = {
  _id: string;
  userId: mongoose.Schema.Types.ObjectId;
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  purchaseDate: Date;
};
