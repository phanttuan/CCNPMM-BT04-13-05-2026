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

const otpTemplates = {
  resetPassword: {
    subject: "Mã OTP đặt lại mật khẩu",
    text: (otp) => `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
  },
  register: {
    subject: "Mã OTP kích hoạt tài khoản",
    text: (otp) =>
      `Mã OTP kích hoạt tài khoản của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
  },
};

const sendOtpEmail = async ({ to, otp, purpose = "resetPassword" }) => {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const template = otpTemplates[purpose] || otpTemplates.resetPassword;

  await transporter.sendMail({
    from,
    to,
    subject: template.subject,
    text: template.text(otp),
  });
};

module.exports = { sendOtpEmail };
