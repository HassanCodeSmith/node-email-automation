import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const outgoingAccountSchema = new Schema(
  {
    AccountName: {
      type: String,
      trim: true,
      required: true,
    },

    Email: {
      type: String,
      trim: true,
      lowercase: true,
      match:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      required: true,
    },

    Password: {
      type: String,
      required: true,
    },

    Proxy: {
      type: String,
      trim: true,
    },

    MaxEmailPerDay: {
      type: Number,
    },

    DelayInMinutes: {
      type: Number,
    },

    Enable: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    Visible: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    UserAgent: {
      type: String,
      trim: true,
    },

    AccountsLogs: [],

    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, collection: "OutgoingAccounts" }
);

// outgoingAccountSchema.pre("save", async function (next) {
//   if (!this.isModified("Password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.Password = bcrypt.hash(this.Password, salt);
//   next();
// });

export const OutgoingAccount = mongoose.model(
  "OutgoingAccount",
  outgoingAccountSchema
);
