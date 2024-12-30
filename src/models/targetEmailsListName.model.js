import mongoose, { Schema } from "mongoose";

const targetEmailsListNameSchema = new Schema(
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
      default: "",
    },

    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, collection: "TargetEmailsListNames" }
);

export const TargetEmailsListName = mongoose.model(
  "TargetEmailsListName",
  targetEmailsListNameSchema
);
