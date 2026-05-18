const productService = require("../services/productService");

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:slug
const getProductDetail = async (req, res) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);

    // Lấy sản phẩm tương tự
    const similar = await productService.getSimilarProducts(
      product.category._id,
      product._id
    );

    res.status(200).json({
      success: true,
      data: { product, similar },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// GET /api/home - dữ liệu trang chủ
const getHomeData = async (req, res) => {
  try {
    const [newest, bestSeller, promotions, featured] = await Promise.all([
      productService.getNewestProducts(8),
      productService.getBestSellerProducts(8),
      productService.getPromotionProducts(8),
      productService.getFeaturedProducts(4),
    ]);

    res.status(200).json({
      success: true,
      data: { newest, bestSeller, promotions, featured },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductDetail, getHomeData };
