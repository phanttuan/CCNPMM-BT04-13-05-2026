const Category = require("../models/Category");

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories };
