import mongoose, { Schema } from "mongoose";

const spintaxSchema = new Schema(
  {
    Name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    Description: {
      type: String,
      trim: true,
      required: true,
    },

    Values: [
      {
        type: String,
        trim: true,
        unique: true,
      },
    ],

    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, collection: "Spintaxes" }
);

export const Spintax = mongoose.model("Spintax", spintaxSchema);
