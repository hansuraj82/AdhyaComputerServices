import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  type: String,
  url: String,
  publicId: String,
  resourceType: {
      type: String,
      enum: ["image", "raw"],
      required: true,
    },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, index: true },
    mobile: { type: String, index: true },
    aadhar: { type: String, unique: true, sparse: true, index: true },
    address: { type: String, index: true },

    documents: [documentSchema],

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
