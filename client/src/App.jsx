import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchPage from "./pages/SearchPage";
import PrivateRoute from "./components/common/PrivateRoute";

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <RegisterPage />}
        />
        <Route
          path="/reset-password"
          element={user ? <Navigate to="/" replace /> : <ResetPasswordPage />}
        />

        {/* Protected routes - yêu cầu đăng nhập */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <PrivateRoute>
              <ProductDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
