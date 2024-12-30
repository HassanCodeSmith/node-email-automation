import mongoose, { Schema } from "mongoose";

const campaignSchema = new Schema(
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

    Subject: {
      type: String,
      trim: true,
      required: true,
    },

    Spintax: {
      type: String,
      trim: true,
    },

    Body: {
      type: String,
      trim: true,
      required: true,
    },

    State: {
      type: String,
      trim: true,
      enum: ["Start", "Pause", "Stop"],
      default: "Pause",
    },

    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    CampaignTargetEmailIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TargetEmailsListName",
      },
    ],

    CampaignOutgoingAccountIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OutgoingAccount",
      },
    ],
  },
  { timestamps: true, collection: "Campaigns" }
);

export const Campaigns = mongoose.model("Campaigns", campaignSchema);
