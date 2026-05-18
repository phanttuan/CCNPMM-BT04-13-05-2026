// Lớp 3: Authentication - xác thực JWT token
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Lấy token từ header Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Không có token. Vui lòng đăng nhập.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gắn thông tin user vào request
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn.",
    });
  }
};

module.exports = { verifyToken };
