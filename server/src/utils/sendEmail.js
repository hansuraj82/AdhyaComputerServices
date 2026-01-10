import nodemailer from "nodemailer";

// 1. Create the transporter ONCE outside the function
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // 16-digit App Password
  },
  // Higher timeouts for cloud environments
  connectionTimeout: 15000, 
  socketTimeout: 15000
});

const sendEmail = async ({ to, subject, text, html }) => {
  // 2. REMOVED: await transporter.verify(); (It's redundant)

  try {
    const info = await transporter.sendMail({
      from: `"Adhya Computer Web Services" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
    return info;
  } catch (err) {
    console.error("Email error:", err);
    throw new Error("SMTP Connection Failed - Port likely blocked by host.");
  }
};

export default sendEmail;