import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Bảo vệ route: chưa đăng nhập thì redirect về /login
const PrivateRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  if (!user || !token) return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;
