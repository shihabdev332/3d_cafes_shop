import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiCheck, FiStar, FiArrowLeft } from "react-icons/fi";
import { getProductDetails } from "../api/shopService";

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductDetails(id);

        if (data && data.success && data.product) {
          setProduct(data.product);
        } else if (data && (data._id || data.id)) {
          setProduct(data);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleCartAction = () => {
    if (onAddToCart && product) {
      onAddToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-amber-500 text-xl font-medium">
        Loading Blend Details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-red-500 gap-4">
        <p className="text-xl font-medium">{error || "Product not found."}</p>
        <button
          onClick={() => navigate("/")}
          className="text-xs uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-amber-500 px-4 py-2 rounded-xl hover:bg-zinc-800 cursor-pointer"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-20 px-4 md:px-12 max-w-7xl mx-auto selection:bg-amber-500 selection:text-zinc-950">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-amber-500 mb-8 transition cursor-pointer"
      >
        <FiArrowLeft size={16} /> Back to Premium Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image Gallery Section */}
        <div className="space-y-4">
          <div
            className="relative h-[450px] md:h-[550px] w-full rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-900/20 cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[activeImage]
                  : "https://via.placeholder.com/600"
              }
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-150 ease-out"
              style={{
                transform: isZoomed ? "scale(2)" : "scale(1)",
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              }}
            />
            {!isZoomed && (
              <span className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 px-3 py-1.5 rounded-md text-zinc-400 pointer-events-none">
                Hover to Zoom
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-3">
            {product.images &&
              product.images.slice(0, 5).map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`h-20 md:h-24 rounded-xl overflow-hidden border transition bg-zinc-950 cursor-pointer ${
                    activeImage === index
                      ? "border-amber-500 ring-2 ring-amber-500/20"
                      : "border-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt="Thumbnail view"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6 lg:sticky lg:top-36">
          <div>
            <span className="text-xs font-bold tracking-[5px] text-amber-500 uppercase block mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-zinc-100 tracking-tight leading-none">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex text-amber-500 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill="currentColor" size={14} />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-300 font-mono">
                {product.rating || 5.0}
              </span>
              <span className="text-zinc-600 text-xs">
                ({product.reviews || 0} reviews)
              </span>
            </div>
          </div>

          <div className="text-3xl font-black text-amber-500 font-mono border-b border-zinc-900 pb-4">
            ${product.price ? Number(product.price).toFixed(2) : "0.00"}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
              The Blend Description
            </h3>
            <p className="text-zinc-400 font-light text-sm leading-relaxed">
              {product.description ||
                "No description available for this premium blend."}
            </p>
          </div>

          {product.features && product.features.length > 0 && (
            <ul className="space-y-2 text-xs font-medium text-zinc-400 bg-zinc-900/20 border border-zinc-900/60 p-4 rounded-xl">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <FiCheck className="text-amber-500 shrink-0" size={14} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleCartAction}
            className={`w-full font-black py-4 rounded-xl text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              isAdded
                ? "bg-emerald-600 text-white shadow-emerald-900/20"
                : "bg-amber-600 text-zinc-950 hover:bg-amber-700 shadow-amber-600/10"
            }`}
          >
            {isAdded ? (
              <>
                <FiCheck size={14} /> Added to Cart!
              </>
            ) : (
              <>
                <FiShoppingBag size={14} /> Add Premium Blend to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
