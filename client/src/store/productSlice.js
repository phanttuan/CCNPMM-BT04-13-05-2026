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
      const { append, ...query } = params;
      const res = await axiosInstance.get("/products", { params: query });
      return { ...res.data.data, append: Boolean(append) };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi tải sản phẩm");
    }
  }
);

// Async thunk: lấy top sản phẩm có phân trang ngang
export const fetchTopProducts = createAsyncThunk(
  "product/fetchTopProducts",
  async ({ type, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/products/top", {
        params: { type, page, limit },
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi tải top sản phẩm"
      );
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
    hasMoreProducts: true,

    // Chi tiết sản phẩm
    currentProduct: null,
    similarProducts: [],
    detailLoading: false,
    detailError: null,

    // Danh mục
    categories: [],

    // Top sản phẩm phân trang ngang
    topBestSeller: { products: [], page: 1, totalPages: 1, loading: false },
    topMostViewed: { products: [], page: 1, totalPages: 1, loading: false },
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
        if (action.payload.append) {
          state.products = [...state.products, ...action.payload.products];
        } else {
          state.products = action.payload.products;
        }
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
        state.hasMoreProducts = action.payload.page < action.payload.totalPages;
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

    // Top Products
    builder
      .addCase(fetchTopProducts.pending, (state, action) => {
        const type = action.meta.arg.type;
        if (type === "mostViewed") {
          state.topMostViewed.loading = true;
        } else {
          state.topBestSeller.loading = true;
        }
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        const target =
          action.payload.type === "mostViewed"
            ? state.topMostViewed
            : state.topBestSeller;
        target.loading = false;
        target.products = action.payload.products;
        target.page = action.payload.page;
        target.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        const type = action.meta.arg.type;
        if (type === "mostViewed") {
          state.topMostViewed.loading = false;
          state.homeError = action.payload;
        } else {
          state.topBestSeller.loading = false;
          state.homeError = action.payload;
        }
      });
  },
});

export const { clearProductErrors } = productSlice.actions;
export default productSlice.reducer;
