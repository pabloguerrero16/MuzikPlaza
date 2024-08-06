import mongoose from "mongoose";
import { ArtistType } from "../shared/types";

const artisSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Artist = mongoose.model<ArtistType>("Artist", artisSchema);
export default Artist;
