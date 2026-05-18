import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../store/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(registerUser(formData));
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
              <h1 className="text-4xl font-bold text-[#191c1e]">Tạo tài khoản</h1>
              <p className="mt-2 text-[#5a6168]">Đăng ký để mua sắm và theo dõi đơn hàng.</p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <h2 className="mb-6 text-center text-2xl font-bold text-[#191c1e]">Đăng ký</h2>

              {error && (
                <div className="mb-4 rounded-lg border border-[#ffdad6] bg-[#fff2f0] px-4 py-3 text-sm text-[#ba1a1a]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#191c1e]">Họ tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nguyen Van A"
                    required
                    className="w-full rounded-xl border border-[#c6c6cd] px-4 py-3 text-sm outline-none focus:border-[#8dc63f]"
                  />
                </div>
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
                  <label className="mb-2 block text-sm font-medium text-[#191c1e]">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912345678"
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
                  className="w-full rounded-xl bg-[#0f172a] py-3 text-lg font-bold text-white hover:bg-[#111827] disabled:opacity-60"
                >
                  {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-[#5a6168]">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-semibold text-[#191c1e] hover:text-[#416900]">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
