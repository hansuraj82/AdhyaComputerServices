import axios from 'axios';



const sendEmail = async ({ to, subject, html, text }) => {
  const url = 'https://api.brevo.com/v3/smtp/email';
  
  const data = {
    sender: { name: "Adhya Computer", email: process.env.EMAIL_USER },
    to: [{ email: to }],
    subject: subject,
    htmlContent: html,
    textContent: text,
    
    // THIS BLOCK DISABLES THE REDIRECT URL
    configuration: {
      clickTracking: false,
      unsubscriptionPageId: 1 // Optional: Helps avoid spam filters
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log("Email Sent! Tracking is now OFF.");
    return response.data;
  } catch (err) {
    console.error("Brevo Error:", err.response?.data || err.message);
    throw new Error("Failed to send clean link");
  }
};



export default sendEmail;