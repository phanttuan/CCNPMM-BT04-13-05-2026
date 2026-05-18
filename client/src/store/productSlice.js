import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";

// Async thunk: lấy dữ liệu trang chủ
export const fetchHomeData = createAsyncThunk(
  "product/fetchHome",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/home");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi tải dữ liệu");
    }
  }
);

// Async thunk: lấy danh sách sản phẩm (tìm kiếm + lọc)
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/products", { params });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi tải sản phẩm");
    }
  }
);

// Async thunk: lấy chi tiết sản phẩm theo slug
export const fetchProductDetail = createAsyncThunk(
  "product/fetchDetail",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/products/${slug}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Không tìm thấy sản phẩm");
    }
  }
);

// Async thunk: lấy danh mục
export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/categories");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi tải danh mục");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    // Trang chủ
    homeData: null,
    homeLoading: false,
    homeError: null,

    // Danh sách sản phẩm
    products: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    listLoading: false,
    listError: null,

    // Chi tiết sản phẩm
    currentProduct: null,
    similarProducts: [],
    detailLoading: false,
    detailError: null,

    // Danh mục
    categories: [],
  },
  reducers: {
    clearProductErrors: (state) => {
      state.listError = null;
      state.detailError = null;
      state.homeError = null;
    },
  },
  extraReducers: (builder) => {
    // Home Data
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.homeLoading = true;
        state.homeError = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.homeLoading = false;
        state.homeData = action.payload;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.homeLoading = false;
        state.homeError = action.payload;
      });

    // Products List
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      });

    // Product Detail
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProduct = action.payload.product;
        state.similarProducts = action.payload.similar;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });

    // Categories
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
  },
});

export const { clearProductErrors } = productSlice.actions;
export default productSlice.reducer;
