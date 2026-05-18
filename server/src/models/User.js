const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên là bắt buộc"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    resetOtpHash: {
      type: String,
      default: "",
    },
    resetOtpExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password trước khi lưu
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// So sánh password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
