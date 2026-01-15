import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";
import resetPasswordTemplate from "../utils/email-templates/resetPasswordTemplate.js";
import { otpEmailTemplate } from "../utils/email-templates/otpTemplates.js";

export const getOwnerEmail = asyncHandler(async (req,res) => {
  const user = await User.find().select("email");
  if(!user) return res.status(404).json({message: "Owner Not Found"})
  res.status(200).json({owner: user});
})

export const loginOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });


  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    _id: user._id,
    email: user.email,
    token: generateToken(user._id)
  });
});

//change password when you are loggedIn
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user || !(await user.matchPassword(currentPassword))) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password changed successfully" });
});


export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found !" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",

    html: resetPasswordTemplate({
      name: user.email,
      resetUrl
    }),
    text: `Reset your password using this link: ${resetUrl}`,
  });

  res.json({ message: "Password Reset Token Sent To Your Email" });
});


//reset password using token
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
});


//RESET EMAIL WHEN LOGGED IN
export const requestEmailChange = asyncHandler(async (req, res) => {
  const { currentPassword, newEmail } = req.body;

  const user = await User.findById(req.user._id);

  if (!user || !(await user.matchPassword(currentPassword))) {
    return res
      .status(401)
      .json({ message: "Current password is incorrect" });
  }

  // check duplicate email
  const emailExists = await User.findOne({ email: newEmail });
  if (emailExists) {
    return res
      .status(409)
      .json({ message: "Email already in use" });
  }

  // generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.pendingEmail = newEmail;
  user.emailChangeOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
  user.emailChangeOTPExpires = Date.now() + 10 * 60 * 1000; // 10 min
  user.emailChangeOTPSentCount = 1;
  user.emailChangeOTPLastSentAt = Date.now();

  await user.save();

  await sendEmail({
  to: newEmail,
  subject: "🔐 Security Verification: New Email Sync",
  text: `Your Adhya Computer verification code is: ${otp}. It expires in 10 mins.`,
  html: otpEmailTemplate(otp)
});

  res.json({
    message: "OTP sent to new email address"
  });
});


//VERIFY EMAIL CHANGE OTP
export const verifyEmailChangeOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const user = await User.findOne({
    _id: req.user._id,
    emailChangeOTP: hashedOtp,
    emailChangeOTPExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid or expired OTP" });
  }

  user.email = user.pendingEmail;

  // cleanup
  user.pendingEmail = undefined;
  user.emailChangeOTP = undefined;
  user.emailChangeOTPExpires = undefined;
  user.emailChangeOTPSentCount = 0;
  user.emailChangeOTPLastSentAt = null;

  await user.save();

  res.json({
    message: "Email changed successfully"
  });
});

//RESEND EMAIL CHANGE OTP
export const resendEmailChangeOTP = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || !user.pendingEmail) {
    return res.status(400).json({
      message: "No active email change request found"
    });
  }

  // cooldown: 60 seconds
  if (
    user.emailChangeOTPLastSentAt &&
    Date.now() - user.emailChangeOTPLastSentAt < 60 * 1000
  ) {
    return res.status(429).json({
      message: "Please wait before requesting a new OTP"
    });
  }

  // If the last OTP was sent more than 1 hour ago, reset the count to 0
  if (user.emailChangeOTPLastSentAt && (Date.now() - user.emailChangeOTPLastSentAt > 60 * 60 * 1000)) {
    user.emailChangeOTPSentCount = 0;
  }

  // max resend attempts
  if (user.emailChangeOTPSentCount >= 3) {
    return res.status(429).json({
      message: "OTP resend limit reached"
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.emailChangeOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
  user.emailChangeOTPExpires = Date.now() + 10 * 60 * 1000;
  user.emailChangeOTPSentCount += 1;
  user.emailChangeOTPLastSentAt = Date.now();

  await user.save();
  
  await sendEmail({
  to: user.pendingEmail,
  subject: "🔐 Security Verification: New Email Sync",
  text: `Your Adhya Computer verification code is: ${otp}. It expires in 10 mins.`,
  html: otpEmailTemplate(otp) // Use the template here
});

  res.json({
    message: "OTP resent successfully"
  });
});
