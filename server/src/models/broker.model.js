import mongoose from "mongoose";

const brokerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    mobile: {
      type: String,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Broker", brokerSchema);
