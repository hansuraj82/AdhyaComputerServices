import axios from 'axios';

const sendEmail = async ({ to, subject, html, text }) => {
  const url = 'https://api.brevo.com/v3/smtp/email';
  
  const data = {
    sender: { name: "Adhya Computer Web Services", email: process.env.EMAIL_USER },
    to: [{ email: to }],
    subject: subject,
    htmlContent: html,
    textContent: text
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'api-key': process.env.BREVO_API_KEY, // This puts it exactly where Brevo wants it
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log("Email Sent via Axios:", response.data.messageId);
    return response.data;
  } catch (err) {
    console.error("Axios/Brevo Error:", err.response?.data || err.message);
    throw new Error("API Authentication Failed");
  }
};

export default sendEmail;