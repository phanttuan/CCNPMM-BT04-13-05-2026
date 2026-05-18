// Lớp 2: Rate Limiting - chống brute-force, DDoS
const rateLimit = require("express-rate-limit");

// Giới hạn cho route đăng nhập: 10 lần / 15 phút
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10,
  message: {
    success: false,
    message: "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Giới hạn chung cho API: 100 lần / 15 phút
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Giới hạn OTP: 3 lần / 10 phút
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Bạn đã yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau 10 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, apiLimiter, otpLimiter };
