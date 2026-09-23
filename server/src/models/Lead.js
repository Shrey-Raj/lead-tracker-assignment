import mongoose from "mongoose";
import { LeadStatus } from "../config/constants.js";

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
  },
  {
    timestamps: true,
  },
);

LeadSchema.index({ name: "text", email: "text", phone: "text" });
LeadSchema.index({ status: 1 });

export const Lead = mongoose.model("Lead", LeadSchema);
