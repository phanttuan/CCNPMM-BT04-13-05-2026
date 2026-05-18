require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);

// Route mặc định
app.get("/", (req, res) => {
  res.json({ message: "🔋 Battery Shop API đang hoạt động!" });
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route không tồn tại" });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
