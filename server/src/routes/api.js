const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// Controllers
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");

// Middleware
const { verifyToken } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { handleValidationErrors } = require("../middleware/validate");
const { loginLimiter, apiLimiter, otpLimiter } = require("../middleware/rateLimiter");

// === AUTH ROUTES ===

// Validation rules cho register
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Tên không được để trống"),
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
  body("phone")
    .optional()
    .isMobilePhone("vi-VN")
    .withMessage("Số điện thoại không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
];

// Validation rules cho login
const loginValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];

// Validation rules cho reset password
const resetPasswordValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
  body("otp").notEmpty().withMessage("OTP không được để trống"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),
];

// Validation rules cho request OTP
const requestOtpValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
];

// POST /api/auth/request-register-otp - Lớp 1 (validate) + Lớp 2 (rate limit)
router.post(
  "/auth/request-register-otp",
  apiLimiter,
  registerValidation,
  handleValidationErrors,
  authController.requestRegisterOtp
);

// POST /api/auth/verify-register-otp - Lớp 1 + Lớp 2
router.post(
  "/auth/verify-register-otp",
  otpLimiter,
  [
    body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
    body("otp").notEmpty().withMessage("OTP không được để trống"),
  ],
  handleValidationErrors,
  authController.verifyRegisterOtp
);

// POST /api/auth/login - Lớp 1 + Lớp 2 (strict)
router.post(
  "/auth/login",
  loginLimiter,
  loginValidation,
  handleValidationErrors,
  authController.login
);

// GET /api/auth/me - Lớp 3 (JWT)
router.get("/auth/me", verifyToken, authController.getMe);

// POST /api/auth/logout - Lớp 3
router.post("/auth/logout", verifyToken, authController.logout);

// POST /api/auth/request-otp - Lớp 1 + Lớp 2
router.post(
  "/auth/request-otp",
  otpLimiter,
  requestOtpValidation,
  handleValidationErrors,
  authController.requestOtp
);

// POST /api/auth/reset-password - Lớp 1 + Lớp 2
router.post(
  "/auth/reset-password",
  apiLimiter,
  resetPasswordValidation,
  handleValidationErrors,
  authController.resetPassword
);

// === PRODUCT ROUTES ===

// GET /api/home - Lớp 3 (cần đăng nhập)
router.get("/home", verifyToken, productController.getHomeData);

// GET /api/products - Lớp 3
router.get("/products", verifyToken, productController.getProducts);

// GET /api/products/:slug - Lớp 3
router.get("/products/:slug", verifyToken, productController.getProductDetail);

// === CATEGORY ROUTES ===
router.get("/categories", verifyToken, categoryController.getCategories);

module.exports = router;
