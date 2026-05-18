const nodemailer = require("nodemailer");

const createTransporter = () => {
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true";

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendOtpEmail = async ({ to, otp }) => {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: "Mã OTP đặt lại mật khẩu",
    text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
  });
};

module.exports = { sendOtpEmail };
