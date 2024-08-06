import mongoose from "mongoose";
import { GenreType } from "../shared/types";

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Genre = mongoose.model<GenreType>("Genre", genreSchema);
export default Genre;
