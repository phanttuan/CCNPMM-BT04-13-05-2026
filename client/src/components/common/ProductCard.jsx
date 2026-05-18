import { Link } from "react-router-dom";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const ProductCard = ({ product }) => {
  const salePrice = product.price - (product.price * product.discount) / 100;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#d5dbe1] bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
    >
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#f2f4f6] p-4">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/320x220?text=Battery"}
          alt={product.name}
          className="max-h-full object-contain transition duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/320x220?text=No+Image";
          }}
        />
        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-sm bg-[#8dc63f] px-2 py-1 text-[10px] font-bold uppercase text-[#1d2b08]">
            -{product.discount}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-[#5a6168]">{product.category?.name || "Sản phẩm"}</p>
        <h3 className="mt-2 line-clamp-2 min-h-12 text-[15px] font-semibold text-[#191c1e]">{product.name}</h3>
        <p className="mt-2 text-xs text-[#5a6168]">{[product.voltage, product.capacity].filter(Boolean).join(" | ")}</p>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="text-lg font-bold text-[#191c1e]">{formatPrice(salePrice)}</p>
            {product.discount > 0 && (
              <p className="text-xs text-[#8e959c] line-through">{formatPrice(product.price)}</p>
            )}
          </div>
          <p className="text-xs text-[#5a6168]">Đã bán {product.sold || 0}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
