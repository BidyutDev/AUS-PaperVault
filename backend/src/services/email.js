import nodemailer from "nodemailer";
import { GMAIL_APP_PASSWORD, GMAIL_USER } from "../config.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
    },
    pool: true,
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Nodemailer Error:", error);
    } else {
        console.log("Nodemailer is ready to send emails");
    }
});

export const sendVerificationEmail = async (
    email,
    otp,
    message = "Thank you for signing up! Please verify your email address using the OTP below:"
) => {
    try {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AUSPAPERVAULT</title>
  <style>
    /* Reset & Base Setup */
    body, p, h1, h2, h3, h4, h5, h6, table, td, div {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    body {
      background-color: #0A0C10;
      color: #C8D2DC;
      -webkit-text-size-adjust: 100%;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      line-height: 100%;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
  </style>
</head>
<body style="background-color: #0A0C10; color: #C8D2DC; margin: 0; padding: 0; width: 100%;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0A0C10; margin: 0; padding: 0; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        
        <!-- Preheader text (hidden in body, shows in email client preview) -->
        <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: #0A0C10;">
          Email Verification OTP - Secure notification from AUS PaperVault.
        </div>

        <!-- Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; width: 100%; background-color: #12151c; border-radius: 12px; border: 1px solid #1E2532; margin: 0 auto; box-shadow: 0 8px 30px rgba(0,0,0,0.4);">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #61DAFB, #AFB3F7); border-radius: 12px 12px 0 0;"></td>
          </tr>
          
          <!-- Content Area -->
          <tr>
            <td style="padding: 40px 35px;">
              
              <!-- Header Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <!-- Email-safe text Logo -->
                    <div style="display: inline-block; padding: 12px 16px; background-color: #161a23; border: 1px solid #232a3b; border-radius: 8px; margin-bottom: 20px;">
                      <span style="font-family: monospace; color: #AFB3F7; font-size: 20px; letter-spacing: 2px; font-weight: 700;">AUS</span><span style="font-family: monospace; color: #61DAFB; font-size: 20px; letter-spacing: 2px; font-weight: 700;">PAPERVAULT</span>
                    </div>
                    
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px;">AUSPAPERVAULT</h1>
                     <p style="color: #AFB3F7; font-size: 14px; margin: 0; font-family: monospace; letter-spacing: 0.5px;">Email Verification</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="color: #C8D2DC; font-size: 15px; line-height: 1.7; padding-bottom: 30px;">
                  ${message}
                  </td>
                </tr>
              </table>

              <!-- OTP Code Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <div style="background-color: #191f2e; border: 2px solid #4a5477; padding: 20px 30px; border-radius: 8px; display: inline-block;">
                      <p style="font-family: monospace; font-size: 32px; font-weight: 700; color: #61DAFB; margin: 0; letter-spacing: 5px;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top: 1px dashed #2a3441; padding-top: 25px; padding-bottom: 25px;"></td>
                </tr>
              </table>

              <!-- Expiry Message -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="color: #7A93AC; font-size: 14px; line-height: 1.6; padding-bottom: 25px; text-align: center;">
                    This OTP will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
                  </td>
                </tr>
              </table>

              <!-- Internal Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <p style="color: #7A93AC; font-size: 12px; font-family: monospace; margin: 0 0 6px 0; line-height: 1.5; text-transform: uppercase; letter-spacing: 0.5px;">
                      Secure Notification System
                    </p>
                    <p style="color: #52667a; font-size: 11px; margin: 0; line-height: 1.5;">
                      &copy; ${new Date().getFullYear().toString()} AUS PaperVault. All rights reserved.<br>
                      This is an automated system message. Do not reply.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        const mailOptions = {
            from: GMAIL_USER,
            to: email,
            subject: "Email Verification OTP - AUS PaperVault",
            html: htmlContent,
            text: `Your OTP is: ${otp}. This code will expire in 10 minutes.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Verification OTP email sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};

export const sendWelcomeEmail = async (email, username) => {
    try {
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
                <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Welcome to AUS PaperVault! 🎓</h1>
                    
                    <p style="color: #555; font-size: 16px; margin-bottom: 15px;">
                        Hi <strong>${username}</strong>,
                    </p>
                    
                    <p style="color: #555; font-size: 16px; margin-bottom: 25px;">
                        Your email has been verified successfully! You now have full access to AUS PaperVault.
                    </p>
                    
                    <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
                        You can now:
                    </p>
                    
                    <ul style="color: #555; font-size: 15px; margin-bottom: 25px; padding-left: 20px;">
                        <li>Browse and download previous year papers</li>
                        <li>Upload and share your papers</li>
                        <li>Create bookmarks for your favorite papers</li>
                        <li>Participate in the community</li>
                    </ul>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
                        © ${new Date().getFullYear().toString()} AUS PaperVault. All rights reserved.
                    </p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"AUS PaperVault" <${GMAIL_USER}>`,
            to: email,
            subject: "Welcome to AUS PaperVault!",
            html: htmlContent,
            text: `Welcome to AUS PaperVault, ${username}! Your email has been verified successfully.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw error;
    }
};

export const sendGlobalNotificationEmail = async (emails, notification) => {
    try {
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; background-color: #0A0C10; color: #C8D2DC; padding: 20px; }
        .card { background-color: #12151c; border-radius: 12px; border: 1px solid #1E2532; max-width: 600px; margin: 0 auto; overflow: hidden; }
        .header { background: linear-gradient(90deg, #61DAFB, #AFB3F7); height: 4px; }
        .content { padding: 30px; }
        h1 { color: #ffffff; font-size: 24px; margin-top: 0; }
        p { line-height: 1.6; }
        .img-container { margin: 20px 0; text-align: center; }
        .img-container img { max-width: 100%; border-radius: 8px; border: 1px solid #2a3441; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #61DAFB; color: #0A0C10; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #7A93AC; border-top: 1px solid #1E2532; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header"></div>
        <div class="content">
            <p style="color: #AFB3F7; font-size: 15px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px;"><span style="color: #C0322F; font-size: 20px;">Announcement</span> from AUS PaperVault</p>
            <h1>${notification.title}</h1>
            <p style="font-size: 10px;">${notification.message}</p>
            
            ${notification.imageUrl ? `
            <div class="img-container">
                <img src="${notification.imageUrl}" alt="Notification Image">
            </div>
            ` : ""}
            
            ${notification.link ? `
            <a href="${notification.link}" class="btn">View Details</a>
            ` : ""}
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} AUS PaperVault. All rights reserved.
        </div>
    </div>
</body>
</html>
        `;

        const mailOptions = {
            from: `"AUS PaperVault" <${GMAIL_USER}>`,
            bcc: emails, // Use BCC to hide user emails from each other
            subject: `Update: ${notification.title} - AUS PaperVault`,
            html: htmlContent,
            text: `${notification.title}\n\n${notification.message}\n\nView more at: ${notification.link || "AUS PaperVault"}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Global notification email sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending global notification email:", error);
        throw error;
    }
};

export default transporter;
