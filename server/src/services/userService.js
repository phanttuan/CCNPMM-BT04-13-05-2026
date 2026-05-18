const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOtpEmail } = require("./emailService");

// Tạo JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Đăng ký
const register = async ({ name, email, password, phone }) => {
  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email đã được sử dụng");
  }

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    },
  };
};

// Đăng nhập
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    },
  };
};

// Lấy thông tin user hiện tại
const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }
  return user;
};

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Gửi OTP reset mật khẩu
const requestPasswordOtp = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const otp = generateOtp();
  user.resetOtpHash = hashOtp(otp);
  user.resetOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendOtpEmail({ to: email, otp });

  return { message: "Đã gửi OTP về email" };
};

// Reset mật khẩu (OTP)
const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  if (!user.resetOtpHash || !user.resetOtpExpires) {
    throw new Error("OTP không hợp lệ");
  }

  const isExpired = user.resetOtpExpires.getTime() < Date.now();
  if (isExpired) {
    throw new Error("OTP đã hết hạn");
  }

  const isMatch = user.resetOtpHash === hashOtp(otp);
  if (!isMatch) {
    throw new Error("OTP không đúng");
  }

  user.password = newPassword;
  user.resetOtpHash = "";
  user.resetOtpExpires = null;
  await user.save();

  return { message: "Đặt lại mật khẩu thành công" };
};

module.exports = { register, login, getMe, requestPasswordOtp, resetPassword };
