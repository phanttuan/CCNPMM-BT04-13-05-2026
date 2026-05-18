// Lớp 4: Authorization - phân quyền theo vai trò (role-based)

// Kiểm tra role (có thể truyền nhiều role được phép)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Chưa xác thực người dùng.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Vai trò '${req.user.role}' không có quyền thực hiện hành động này.`,
      });
    }

    next();
  };
};

module.exports = { authorize };
