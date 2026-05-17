// utils/sendEmail.js

import nodemailer from "nodemailer";
import logger from "./logger.js";

// =============================================
// TRANSPORTER
// =============================================

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,

    port: parseInt(process.env.SMTP_PORT) || 587,

    secure: process.env.SMTP_PORT === "465",

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },

    tls: {
      rejectUnauthorized:
        process.env.NODE_ENV === "production",
    },
  });
};

// =============================================
// EMAIL TEMPLATES
// =============================================

const emailTemplates = {
  base: (content) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>Amazon Clone</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f3f3f3;
            color: #333;
          }

          .container {
            max-width: 600px;
            margin: 30px auto;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
          }

          .header {
            background: #131921;
            padding: 20px;
            text-align: center;
          }

          .header h1 {
            color: #ff9900;
          }

          .body {
            padding: 30px;
          }

          .footer {
            background: #232f3e;
            padding: 20px;
            text-align: center;
            color: #aaa;
            font-size: 12px;
          }

          .btn {
            display: inline-block;
            padding: 14px 28px;
            background: #ff9900;
            color: #111 !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
          } 

          .otp {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #ff9900;
            text-align: center;
            padding: 20px;
            background: #f8f8f8;
            border-radius: 8px;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="header">
            <h1>🛒 Amazon Clone</h1>
          </div>

          <div class="body">
            ${content}
          </div>

          <div class="footer">
            <p>
              © ${new Date().getFullYear()}
              Amazon Clone
            </p>
          </div>
        </div>
      </body>
    </html>
  `,

  welcomeEmail: (name, verificationUrl) => ({
    subject:
      "Welcome to Amazon Clone! Verify your email",

    html: emailTemplates.base(`
      <h2>Welcome, ${name}! 🎉</h2>

      <p>
        Thank you for creating an account.
      </p>

      <p style="text-align:center; margin-top:20px;">
        <a
          href="${verificationUrl}"
          class="btn"
        >
          Verify Email
        </a>
      </p>
    `),
  }),

  passwordReset: (name, resetUrl) => ({
    subject:
      "Password Reset Request - Amazon Clone",

    html: emailTemplates.base(`
      <h2>Reset Your Password</h2>

      <p>
        Hi ${name}, click below to reset
        your password.
      </p>

      <p style="text-align:center; margin-top:20px;">
        <a
          href="${resetUrl}"
          class="btn"
        >
          Reset Password
        </a>
      </p>
    `),
  }),

  otpEmail: (name, otp) => ({
    subject: "Your OTP - Amazon Clone",

    html: emailTemplates.base(`
      <h2>Your Verification Code</h2>

      <p>
        Hi ${name}, here is your OTP:
      </p>

      <div class="otp">
        ${otp}
      </div>
    `),
  }),
};

// =============================================
// SEND EMAIL FUNCTION
// =============================================

const sendEmail = async ({
  to,
  subject,
  html,
  text,
  attachments = [],
}) => {
  try {
    const transporter = createTransporter();

    await transporter.verify();

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,

      to,

      subject,

      html,

      text:
        text ||
        html.replace(/<[^>]*>/g, ""),

      attachments,
    };

    const info = await transporter.sendMail(
      mailOptions
    );

    logger.info(
      `Email sent to ${to}: ${info.messageId}`
    );

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error(
      `Email send failed to ${to}:`,
      error
    );

    throw new Error(
      `Email could not be sent: ${error.message}`
    );
  }
};

// =============================================
// CONVENIENCE FUNCTIONS
// =============================================

const sendWelcomeEmail = (
  user,
  verificationUrl
) => {
  const { subject, html } =
    emailTemplates.welcomeEmail(
      user.name,
      verificationUrl
    );

  return sendEmail({
    to: user.email,
    subject,
    html,
  });
};

const sendPasswordResetEmail = (
  user,
  resetUrl
) => {
  const { subject, html } =
    emailTemplates.passwordReset(
      user.name,
      resetUrl
    );

  return sendEmail({
    to: user.email,
    subject,
    html,
  });
};

const sendOtpEmail = (user, otp) => {
  const { subject, html } =
    emailTemplates.otpEmail(
      user.name,
      otp
    );

  return sendEmail({
    to: user.email,
    subject,
    html,
  });
};

export {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOtpEmail,
};