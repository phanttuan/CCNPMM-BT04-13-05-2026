const Product = require("../models/Product");

// Lấy tất cả sản phẩm (kèm lọc, tìm kiếm, phân trang)
const getAllProducts = async (query) => {
  const {
    search = "",
    category = "",
    brand = "",
    batteryType = "",
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    sort = "-createdAt",
    page = 1,
    limit = 12,
  } = query;

  const filter = { isActive: true };

  // Tìm kiếm theo tên
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  // Lọc theo danh mục
  if (category) {
    filter.category = category;
  }

  // Lọc theo thương hiệu
  if (brand) {
    filter.brand = { $regex: brand, $options: "i" };
  }

  // Lọc theo loại pin
  if (batteryType) {
    filter.batteryType = batteryType;
  }

  // Lọc theo giá
  filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug icon")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  };
};

// Lấy sản phẩm theo slug
const getProductBySlug = async (slug) => {
  const product = await Product.findOneAndUpdate(
    { slug, isActive: true },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("category", "name slug icon");
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm");
  }
  return product;
};

// Sản phẩm mới nhất
const getNewestProducts = async (limit = 8) => {
  return await Product.find({ isActive: true })
    .populate("category", "name slug")
    .sort("-createdAt")
    .limit(limit);
};

// Sản phẩm bán chạy nhất
const getBestSellerProducts = async (limit = 8) => {
  return await Product.find({ isActive: true })
    .populate("category", "name slug")
    .sort("-sold")
    .limit(limit);
};

// Sản phẩm xem nhiều nhất
const getMostViewedProducts = async (limit = 8) => {
  return await Product.find({ isActive: true })
    .populate("category", "name slug")
    .sort("-views")
    .limit(limit);
};

// Top sản phẩm có phân trang theo loại
const getTopProducts = async ({ type = "bestSeller", page = 1, limit = 5 }) => {
  const sortMap = {
    bestSeller: "-sold",
    mostViewed: "-views",
  };

  const normalizedPage = Math.max(1, Number(page) || 1);
  const normalizedLimit = Math.max(1, Number(limit) || 5);
  const sort = sortMap[type] || sortMap.bestSeller;
  const topLimit = 10;
  const skip = (normalizedPage - 1) * normalizedLimit;

  const topProducts = await Product.find({ isActive: true })
    .populate("category", "name slug icon")
    .sort(sort)
    .limit(topLimit);

  const total = topProducts.length;
  const products = topProducts.slice(skip, skip + normalizedLimit);

  return {
    type,
    products,
    total,
    page: normalizedPage,
    totalPages: Math.ceil(total / normalizedLimit) || 1,
  };
};

// Sản phẩm khuyến mãi
const getPromotionProducts = async (limit = 8) => {
  return await Product.find({ isActive: true, isPromotion: true })
    .populate("category", "name slug")
    .sort("-discount")
    .limit(limit);
};

// Sản phẩm nổi bật
const getFeaturedProducts = async (limit = 4) => {
  return await Product.find({ isActive: true, isFeatured: true })
    .populate("category", "name slug")
    .limit(limit);
};

// Sản phẩm tương tự (cùng danh mục)
const getSimilarProducts = async (categoryId, excludeId, limit = 4) => {
  return await Product.find({
    isActive: true,
    category: categoryId,
    _id: { $ne: excludeId },
  })
    .populate("category", "name slug")
    .limit(limit);
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  getNewestProducts,
  getBestSellerProducts,
  getMostViewedProducts,
  getTopProducts,
  getPromotionProducts,
  getFeaturedProducts,
  getSimilarProducts,
};
