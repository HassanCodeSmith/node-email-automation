import mongoose, { Schema } from "mongoose";

const targetEmailSchema = new Schema(
  {
    Email: {
      type: String,
      trim: true,
      lowercase: true,
      match:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      required: true,
    },

    FirstName: {
      type: String,
      trim: true,
      required: true,
    },

    LastName: {
      type: String,
      trim: true,
      required: true,
    },

    FirstLine: {
      type: String,
      trim: true,
    },

    isEmailSended: {
      type: Boolean,
      default: false,
    },

    TargetEmailsListNameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TargetEmailsListName",
      required: true,
    },

    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, collection: "TargetEmails" }
);

export const TargetEmail = mongoose.model("TargetEmail", targetEmailSchema);
