import mongoose from "mongoose";
const auditSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  action: String,

  entity: String,

  entityId: mongoose.Schema.Types.ObjectId,

  details: String

}, { timestamps: true });

export default mongoose.model("Audit", auditSchema);