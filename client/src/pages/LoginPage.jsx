import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../store/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef9c3_0%,_#eef2f7_45%,_#dfe7f1_100%)] px-4 py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="w-full rounded-3xl border border-[#d5dbe1] bg-gradient-to-r from-[#eff6ff] via-[#f7f9fb] to-[#eaf4ff] p-6 md:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b8f26a] text-[#1d2b08] shadow-lg">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="7" width="16" height="10" rx="2" fill="#1d2b08" />
                  <rect x="19" y="10" width="2" height="4" rx="1" fill="#1d2b08" />
                  <rect x="6" y="10" width="6" height="4" rx="1" fill="#b8f26a" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-[#191c1e]">PIN CAO CẤP</h1>
              <p className="mt-2 text-[#5a6168]">Hệ thống năng lượng chất lượng cao</p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <h2 className="mb-6 text-center text-3xl font-bold text-[#191c1e]">Đăng nhập tài khoản</h2>

              {error && (
                <div className="mb-4 rounded-lg border border-[#ffdad6] bg-[#fff2f0] px-4 py-3 text-sm text-[#ba1a1a]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#191c1e]">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@battery.com"
                    required
                    className="w-full rounded-xl border border-[#c6c6cd] px-4 py-3 text-sm outline-none focus:border-[#8dc63f]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#191c1e]">Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="******"
                    required
                    className="w-full rounded-xl border border-[#c6c6cd] px-4 py-3 text-sm outline-none focus:border-[#8dc63f]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#facc15] py-3 text-lg font-bold text-[#191c1e] hover:bg-[#eab308] disabled:opacity-60"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-between text-sm">
                <Link to="/reset-password" className="font-semibold text-[#191c1e] hover:text-[#416900]">
                  Quên mật khẩu?
                </Link>
                <Link to="/register" className="font-semibold text-[#191c1e] hover:text-[#416900]">
                  Tạo tài khoản
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
