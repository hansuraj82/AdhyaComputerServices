const sendEmail = async ({ to, subject, html, text }) => {
  const url = 'https://api.brevo.com/v3/smtp/email';
  
  const data = {
    sender: { name: "Adhya Computer", email: process.env.EMAIL_USER },
    to: [{ email: to }],
    subject: subject,
    htmlContent: html,
    textContent: text,
    headers: {
      "X-Mailin-Tag": "PasswordReset",
      "X-Mailin-custom": "click_tracking_off"
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
    return response.data;
  } catch (err) {
    throw new Error("Email delivery failed");
  }
};

export default sendEmail;