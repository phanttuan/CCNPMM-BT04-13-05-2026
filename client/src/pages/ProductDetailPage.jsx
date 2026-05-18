import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail } from "../store/productSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import EmptyState from "../components/common/EmptyState";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, similarProducts, detailLoading, detailError } = useSelector((state) => state.product);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchProductDetail(slug));
    setQty(1);
    window.scrollTo(0, 0);
  }, [slug, dispatch]);

  if (detailLoading) return <div className="p-10 text-center text-[#5a6168]">Đang tải sản phẩm...</div>;
  if (detailError || !currentProduct) return <EmptyState title="Không tìm thấy sản phẩm" message={detailError} />;

  const p = currentProduct;
  const salePrice = p.price - (p.price * p.discount) / 100;
  const inStock = p.stock > 0;

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-6 text-sm text-[#5a6168]">
          <Link to="/" className="hover:text-[#191c1e]">Trang chủ</Link> / <Link to="/search" className="hover:text-[#191c1e]">Sản phẩm</Link> / <span className="text-[#191c1e]">{p.name}</span>
        </nav>

        <div className="overflow-hidden rounded-xl border border-[#d5dbe1] bg-white">
          <div className="grid md:grid-cols-2">
            <div className="bg-[#f2f4f6] p-6">
              {p.images?.length > 1 ? (
                <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }}>
                  {p.images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img src={img} alt={`${p.name}-${i}`} className="h-80 w-full rounded-lg object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img src={p.images?.[0]} alt={p.name} className="h-80 w-full rounded-lg object-cover" />
              )}
            </div>

            <div className="p-6">
              <h1 className="text-3xl font-bold text-[#191c1e]">{p.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-[#5a6168]">{p.description}</p>

              <div className="mt-5 rounded-lg bg-[#eceef0] p-4">
                <p className="text-3xl font-bold text-[#191c1e]">{formatPrice(salePrice)}</p>
                {p.discount > 0 && <p className="text-sm text-[#8a9097] line-through">{formatPrice(p.price)}</p>}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-[#f7f9fb] p-3">Thương hiệu: <strong>{p.brand || "N/A"}</strong></div>
                <div className="rounded-lg bg-[#f7f9fb] p-3">Loại pin: <strong>{p.batteryType || "N/A"}</strong></div>
                <div className="rounded-lg bg-[#f7f9fb] p-3">Điện áp: <strong>{p.voltage || "N/A"}</strong></div>
                <div className="rounded-lg bg-[#f7f9fb] p-3">Dung lượng: <strong>{p.capacity || "N/A"}</strong></div>
              </div>

              <div className="mt-4 text-sm text-[#5a6168]">Đã bán: {p.sold || 0} | Tồn kho: {p.stock || 0}</div>

              {inStock && (
                <div className="mt-5 flex items-center gap-3">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 rounded-md border border-[#c6c6cd] bg-white text-lg">-</button>
                  <span className="min-w-10 text-center text-base font-semibold">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} className="h-10 w-10 rounded-md border border-[#c6c6cd] bg-white text-lg">+</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {similarProducts?.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 border-b border-[#d5dbe1] pb-3">
              <h2 className="text-3xl font-bold text-[#191c1e]">Sản phẩm tương tự</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((sp) => <ProductCard key={sp._id} product={sp} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
