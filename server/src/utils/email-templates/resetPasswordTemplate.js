// const resetPasswordTemplate = ({ name, resetUrl }) => {
//   return `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <meta charset="UTF-8" />
//       <title>Reset Password</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           background-color: #f4f4f4;
//           padding: 20px;
//         }
//         .container {
//           max-width: 500px;
//           background: #ffffff;
//           margin: auto;
//           padding: 20px;
//           border-radius: 6px;
//         }
//         .btn {
//           display: inline-block;
//           padding: 12px 18px;
//           background-color: #000000;
//           color: #ffffff !important;
//           text-decoration: none;
//           border-radius: 4px;
//           margin-top: 16px;
//         }
//         .footer {
//           margin-top: 24px;
//           font-size: 12px;
//           color: #666;
//         }
//       </style>
//     </head>

//     <body>
//       <div class="container">
//         <h2>Password Reset Request</h2>

//         <p>Hello ${name || "User"},</p>

//         <p>
//           We received a request to reset your password for your
//           <strong>Adhya Computer</strong> account.
//         </p>

//         <p>
//           Click the button below to reset your password.
//           This link will expire in <strong>15 minutes</strong>.
//         </p>

//         <a href="${resetUrl}" class="btn">
//           Reset Password
//         </a>

//         <p class="footer">
//           If you didn’t request this, you can safely ignore this email.
//           Your password will not be changed.
//         </p>
//       </div>
//     </body>
//   </html>
//   `;
// };

// export default resetPasswordTemplate;

const resetPasswordTemplate = ({ name, resetUrl }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Password Reset</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
            
            <tr>
              <td align="center" style="padding: 40px 40px 20px 40px;">
                <div style="background-color: #f1f5f9; width: 64px; height: 64px; border-radius: 16px; display: inline-block; line-height: 64px; text-align: center; margin-bottom: 20px; border: 1px solid #e2e8f0;">
                  <span style="font-size: 24px;">🔐</span>
                </div>
                <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; text-transform: uppercase;">
                  Secure Recovery
                </h1>
                <p style="margin: 8px 0 0 0; font-size: 12px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.15em;">
                  Adhya Computer Admin
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 40px 40px 40px; text-align: center;">
                <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                  Hello <strong>${name || "Administrator"}</strong>,<br>
                  A security override was requested for your account password.
                </p>

                <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; margin-bottom: 24px;">
                  <p style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; color: #64748b;">
                    This recovery link is valid for 15 minutes:
                  </p>
                  <a href="${resetUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);">
                    Reset Password
                  </a>
                </div>

                <p style="font-size: 12px; line-height: 1.6; color: #94a3b8; margin: 0;">
                  If you did not initiate this request, please contact your system architect immediately. No changes have been applied to your account.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0; font-size: 10px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.2em;">
                  Secure Node: ${new Date().getFullYear()} • ADHYA_SYSTEM_V2
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

export default resetPasswordTemplate;