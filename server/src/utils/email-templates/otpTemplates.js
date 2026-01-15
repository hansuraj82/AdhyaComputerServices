export const otpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9; }
    .logo { font-size: 20px; font-weight: 900; color: #6366f1; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 30px 0; text-align: center; }
    .otp-card { background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 25px; margin: 20px 0; display: inline-block; }
    .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0f172a; font-family: monospace; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; border-top: 2px solid #f1f5f9; padding-top: 20px; }
    .warning { color: #ef4444; font-size: 13px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Adhya Computer</div>
    </div>
    <div class="content">
      <h2 style="margin-top: 0;">Identity Sync Verification</h2>
      <p>A request was made to update your identity node. Use the secure key below to authorize the change:</p>
      
      <div class="otp-card">
        <div class="otp-code">${otp}</div>
      </div>
      
      <p class="warning">This verification key expires in 10 minutes.</p>
      <p style="font-size: 14px; color: #64748b;">If you did not initiate this request, please ignore this email or secure your account immediately.</p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Adhya Computer • Identity Management System
    </div>
  </div>
</body>
</html>
`;