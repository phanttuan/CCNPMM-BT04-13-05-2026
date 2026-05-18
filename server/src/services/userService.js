const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
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

const buildAuthPayload = (user) => ({
  token: generateToken(user),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
  },
});

// Gửi OTP đăng ký
const requestRegisterOtp = async ({ name, email, password, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email đã được sử dụng");
  }

  const otp = generateOtp();
  await PendingRegistration.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password,
      phone: phone || "",
      otpHash: hashOtp(otp),
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await sendOtpEmail({ to: email, otp, purpose: "register" });
  return { message: "Đã gửi OTP kích hoạt về email" };
};

// Xác thực OTP và tạo tài khoản
const verifyRegisterOtp = async ({ email, otp }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    await PendingRegistration.deleteOne({ email });
    throw new Error("Email đã được sử dụng");
  }

  const pending = await PendingRegistration.findOne({ email });
  if (!pending) {
    throw new Error("Không tìm thấy yêu cầu đăng ký. Vui lòng gửi OTP lại");
  }

  if (pending.otpExpires.getTime() < Date.now()) {
    throw new Error("OTP đã hết hạn");
  }

  if (pending.otpHash !== hashOtp(otp)) {
    throw new Error("OTP không đúng");
  }

  const user = await User.create({
    name: pending.name,
    email: pending.email,
    password: pending.password,
    phone: pending.phone,
  });

  await PendingRegistration.deleteOne({ email });
  return buildAuthPayload(user);
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

  await sendOtpEmail({ to: email, otp, purpose: "resetPassword" });

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

module.exports = {
  requestRegisterOtp,
  verifyRegisterOtp,
  login,
  getMe,
  requestPasswordOtp,
  resetPassword,
};
