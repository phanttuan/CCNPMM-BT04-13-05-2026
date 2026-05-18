import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/authSlice";
import { useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#d5dbe1] bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-3xl font-extrabold tracking-tight text-[#191c1e]">PIN CAO CẤP</Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={({ isActive }) => `text-sm ${isActive ? "font-bold text-[#191c1e]" : "text-[#5a6168] hover:text-[#191c1e]"}`}>Trang chủ</NavLink>
          <NavLink to="/search" className={({ isActive }) => `text-sm ${isActive ? "font-bold text-[#191c1e]" : "text-[#5a6168] hover:text-[#191c1e]"}`}>Sản phẩm</NavLink>
        </nav>

        {user && (
          <div className="relative">
            <button onClick={() => setMenuOpen((s) => !s)} className="flex items-center gap-3 rounded-lg border border-[#d5dbe1] bg-[#f2f4f6] px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0f172a] text-xs font-bold text-white">{user.name?.charAt(0)?.toUpperCase()}</div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-[#191c1e]">{user.name}</p>
                <p className="text-xs text-[#5a6168] capitalize">{user.role}</p>
              </div>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-[#d5dbe1] bg-white shadow-lg">
                <div className="border-b border-[#edf1f4] px-4 py-3">
                  <p className="text-sm font-semibold text-[#191c1e]">{user.name}</p>
                  <p className="text-xs text-[#5a6168]">{user.email}</p>
                </div>
                <Link to="/profile" className="block px-4 py-3 text-sm font-medium text-[#191c1e] hover:bg-[#f2f4f6]">
                  Thông tin tài khoản
                </Link>
                <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-sm font-medium text-[#ba1a1a] hover:bg-[#fff0ee]">Đăng xuất</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
