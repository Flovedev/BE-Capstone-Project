import { Document, Model, Schema, model } from "mongoose";

interface IOver extends Document {
  id: number;
  name: string;
  cover?: string;
  rating?: string;
  release_date?: string;
  platforms?: {
    name: string;
    abbreviation: string;
  }[];
  genres?: {
    name: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const OversSchema = new Schema<IOver, Model<IOver>, IOver>(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    cover: { type: String, required: true },
    rating: { type: String, required: true },
    release_date: { type: String, required: true },
    platforms: { type: Array, required: true },
    genres: { type: Array, required: true },
  },
  { timestamps: true }
);

const OversModel = model<IOver>("Over", OversSchema);

export { IOver, OversModel };
