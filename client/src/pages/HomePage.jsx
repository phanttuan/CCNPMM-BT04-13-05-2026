import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchHomeData } from "../store/productSlice";
import ProductCard from "../components/common/ProductCard";
import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const HomePage = () => {
  const dispatch = useDispatch();
  const { homeData, homeLoading, homeError } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  if (homeLoading) return <div className="p-10 text-center text-[#5a6168]">Đang tải dữ liệu...</div>;
  if (homeError) return <EmptyState title="Không thể tải dữ liệu" message={homeError} />;

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Header />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl bg-[#acf847] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#304f00]">Ưu đãi thành viên</p>
            <h3 className="mt-3 text-3xl font-bold text-[#1b2a04]">Giảm 20% dòng pin sạc</h3>
            <p className="mt-2 text-sm text-[#304f00]">Nhập mã ENELOOP20 khi thanh toán.</p>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-[#131b2e] p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bec6e0]">Mua nhiều giảm sâu</p>
            <h3 className="mt-3 text-3xl font-bold">Mua 3 tặng 1 pin lithium</h3>
            <p className="mt-2 text-sm text-[#bec6e0]">Áp dụng cho dòng AA/AAA chuyên dụng.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <SectionHeader title="Sản phẩm mới nhất" subtitle="Cập nhật công nghệ năng lượng" action={<Link to="/search?sort=-createdAt" className="text-xs font-semibold uppercase tracking-wider text-[#191c1e] hover:text-[#416900]">Xem tất cả</Link>} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {homeData?.newest?.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionHeader title="Sản phẩm bán chạy" subtitle="Được nhiều khách hàng lựa chọn" action={<Link to="/search?sort=-sold" className="text-xs font-semibold uppercase tracking-wider text-[#191c1e] hover:text-[#416900]">Xem tất cả</Link>} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {homeData?.bestSeller?.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
