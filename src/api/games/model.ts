import { Document, Model, Schema, model } from "mongoose";

interface IOver extends Document {
  _id: number;
  name: string;
  cover?: string;
  rating?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OversSchema = new Schema<IOver, Model<IOver>, IOver>(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    cover: { type: String, required: true },
    rating: { type: String, required: true },
  },
  { timestamps: true }
);

const OversModel = model<IOver>("Over", OversSchema);

export { IOver, OversModel };
