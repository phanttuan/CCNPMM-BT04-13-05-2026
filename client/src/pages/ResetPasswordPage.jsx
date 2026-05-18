import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { resetPassword, requestOtp, clearError } from "../store/authSlice";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", otp: "", newPassword: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
    if (successMessage) setSuccessMessage("");
    if (otpMessage) setOtpMessage("");
  };

  const handleSendOtp = async () => {
    if (!formData.email) return;
    const result = await dispatch(requestOtp({ email: formData.email }));
    if (requestOtp.fulfilled.match(result)) {
      setOtpMessage("Đã gửi OTP về email. Vui lòng kiểm tra hộp thư.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(resetPassword(formData));
    if (resetPassword.fulfilled.match(result)) {
      setSuccessMessage("Đã đặt lại mật khẩu. Hãy đăng nhập lại.");
    }
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
              <h1 className="text-4xl font-bold text-[#191c1e]">Reset mật khẩu</h1>
              <p className="mt-2 text-[#5a6168]">Nhập email và mật khẩu mới để tiếp tục.</p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <h2 className="mb-6 text-center text-2xl font-bold text-[#191c1e]">Cập nhật mật khẩu</h2>

              {error && (
                <div className="mb-4 rounded-lg border border-[#ffdad6] bg-[#fff2f0] px-4 py-3 text-sm text-[#ba1a1a]">
                  {error}
                </div>
              )}
              {otpMessage && (
                <div className="mb-4 rounded-lg border border-[#cfe9ff] bg-[#ecf5ff] px-4 py-3 text-sm text-[#1e3a8a]">
                  {otpMessage}
                </div>
              )}
              {successMessage && (
                <div className="mb-4 rounded-lg border border-[#acf847] bg-[#f1fbe1] px-4 py-3 text-sm text-[#416900]">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#191c1e]">Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@battery.com"
                      required
                      className="w-full rounded-xl border border-[#c6c6cd] px-4 py-3 text-sm outline-none focus:border-[#8dc63f]"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="whitespace-nowrap rounded-xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#111827] disabled:opacity-60"
                    >
                      Gửi OTP
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#191c1e]">Mã OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="123456"
                    required
                    className="w-full rounded-xl border border-[#c6c6cd] px-4 py-3 text-sm outline-none focus:border-[#8dc63f]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#191c1e]">Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
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
                  {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-[#5a6168]">
                <Link to="/login" className="font-semibold text-[#191c1e] hover:text-[#416900]">
                  Quay lại đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
