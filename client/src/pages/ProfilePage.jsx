import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "../store/authSlice";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) dispatch(fetchMe());
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-[#d5dbe1] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#191c1e]">Thông tin tài khoản</h1>

          {loading ? (
            <p className="mt-6 text-sm text-[#5a6168]">Đang tải...</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#f2f4f6] p-4">
                <p className="text-xs uppercase tracking-wider text-[#5a6168]">Họ tên</p>
                <p className="mt-2 text-sm font-semibold text-[#191c1e]">{user?.name || "-"}</p>
              </div>
              <div className="rounded-xl bg-[#f2f4f6] p-4">
                <p className="text-xs uppercase tracking-wider text-[#5a6168]">Email</p>
                <p className="mt-2 text-sm font-semibold text-[#191c1e]">{user?.email || "-"}</p>
              </div>
              <div className="rounded-xl bg-[#f2f4f6] p-4">
                <p className="text-xs uppercase tracking-wider text-[#5a6168]">Vai trò</p>
                <p className="mt-2 text-sm font-semibold text-[#191c1e] capitalize">{user?.role || "-"}</p>
              </div>
              <div className="rounded-xl bg-[#f2f4f6] p-4">
                <p className="text-xs uppercase tracking-wider text-[#5a6168]">Số điện thoại</p>
                <p className="mt-2 text-sm font-semibold text-[#191c1e]">{user?.phone || "-"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
