const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "🔋",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
