import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "owner" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailChangeOTP: String,
  emailChangeOTPExpires: Date,
  pendingEmail: String,
  emailChangeOTPSentCount: {
    type: Number,
    default: 0
  },
  emailChangeOTPLastSentAt: Date

});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);
