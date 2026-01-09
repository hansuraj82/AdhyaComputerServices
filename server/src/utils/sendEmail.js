import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE_TYPE, // e.g. "gmail"
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify connection
  await transporter.verify();

  try {
    await transporter.sendMail({
      from: `"Adhya Computer Web Services" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
  } catch (err) {
    console.error("Email error:", err);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
