import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";

// Async thunk: đăng ký
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", { name, email, phone, password });
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng ký thất bại"
      );
    }
  }
);

// Async thunk: reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", { email, otp, newPassword });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Reset mật khẩu thất bại"
      );
    }
  }
);

// Async thunk: request OTP
export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/request-otp", { email });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gui OTP that bai"
      );
    }
  }
);

// Async thunk: đăng nhập (dùng Axios)
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data.data;
      // Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);

// Async thunk: đăng xuất
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (_) {}
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

// Async thunk: lấy thông tin user hiện tại
export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi xác thực");
    }
  }
);

// Lấy state ban đầu từ localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Request OTP
    builder
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
    });

    // Fetch Me
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
