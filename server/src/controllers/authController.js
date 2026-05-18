const userService = require("../services/userService");

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const result = await userService.register({ name, email, password, phone });
    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login({ email, password });
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: result,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me  (yêu cầu verifyToken)
const getMe = async (req, res) => {
  try {
    const user = await userService.getMe(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  // Client tự xóa token ở localStorage
  res.status(200).json({ success: true, message: "Đăng xuất thành công" });
};

// POST /api/auth/request-otp
const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.requestPasswordOtp({ email });
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await userService.resetPassword({ email, otp, newPassword });
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, logout, requestOtp, resetPassword };
