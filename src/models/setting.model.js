import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema(
  {
    MaxBroswersAllowed: {
      type: Number,
      required: true,
    },

    GoLoginToken: {
      type: String,
      trim: true,
      required: true,
    },

    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, collection: "Settings" }
);

export const Settings = mongoose.model("Settings", settingsSchema);
