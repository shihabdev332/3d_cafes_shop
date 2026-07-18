import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { getShopMenu } from "../api/shopService";
import { FiSearch, FiLayers, FiCheck } from "react-icons/fi";

const ShopMenu = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Real-time search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [successBadgeId, setSuccessBadgeId] = useState(null);

  // Initialize navigation hook
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getShopMenu();
        // Fallback to support different potential response structures safely
        const menuItems = data.products || data;
        setProducts(Array.isArray(menuItems) ? menuItems : []);
      } catch (err) {
        setError(err.message || "Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Handle safe click actions for adding items to cart
  const handleAddToCartClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents triggering the card's onClick navigation

    if (onAddToCart) {
      onAddToCart(product);
      setSuccessBadgeId(product._id);
      setTimeout(() => setSuccessBadgeId(null), 1200);
    }
  };

  // Dynamically extract unique categories from products array
  const categoriesList = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // Perform real-time filtering based on search query and category tab selection
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-amber-500 text-xl font-medium">
        Loading Premium Menu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-500 text-xl font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-12 px-6 md:px-12">
      {/* Premium Header Design */}
      <header className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold tracking-[5px] text-amber-500 uppercase block mb-3">
          The Art of Brewing
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-zinc-100 mb-4 tracking-tight">
          OUR PREMIUM MENU
        </h1>
        <p className="text-zinc-500 text-sm md:text-base font-light leading-relaxed">
          Experience coffee refined through premium beans, unique crafting
          techniques, and interactive visual showcases.
        </p>
      </header>

      {/* Real-time Search and Filter Control Panel */}
      <div className="max-w-7xl mx-auto mb-12 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/30 p-4 border border-zinc-900 rounded-2xl backdrop-blur-md">
          {/* Live Search Input Bar */}
          <div className="relative w-full md:w-96">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search premium blends, espresso, cold brews..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-amber-500/50 text-zinc-200 placeholder-zinc-600 transition"
            />
          </div>

          {/* Dynamic Category Pill Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            {categoriesList.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition active:scale-95 cursor-pointer ${
                  selectedCategory === category
                    ? "bg-amber-600 text-zinc-950 shadow-lg shadow-amber-600/10"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout Canvas */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-2xl max-w-md mx-auto">
          <FiLayers size={32} className="mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-base font-light">
            No premium blends match your filtering criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-zinc-900/20 border border-zinc-900/80 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 group flex flex-col justify-between hover:shadow-2xl hover:shadow-black/50 cursor-pointer"
            >
              <div>
                {/* Visual Area Setup */}
                {product.is3DModelAvailable ? (
                  <div className="h-52 bg-zinc-900/60 border border-zinc-900 rounded-xl flex flex-col items-center justify-center mb-5 relative overflow-hidden group-hover:bg-zinc-900/80 transition">
                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest mb-2 border border-amber-500/20">
                      3D View Ready
                    </span>
                    <span className="text-xs text-zinc-600 font-mono">
                      [ Canvas Placeholder ]
                    </span>
                  </div>
                ) : (
                  <div className="h-52 w-full rounded-xl mb-5 overflow-hidden border border-zinc-900/60 relative">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : "https://via.placeholder.com/400x300"
                      }
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
                    />
                  </div>
                )}

                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-xl font-bold text-zinc-100 group-hover:text-amber-500 transition duration-300 line-clamp-1">
                    {product.name}
                  </h3>
                  <span className="text-[10px] uppercase font-bold bg-zinc-900 px-2.5 py-1 rounded-md text-zinc-400 border border-zinc-800 shrink-0 tracking-wide">
                    {product.category}
                  </span>
                </div>

                <p className="text-zinc-500 text-xs line-clamp-2 mb-6 font-light leading-relaxed min-h-[32px]">
                  {product.description ||
                    "No description provided for this premium blend."}
                </p>
              </div>

              {/* Price and Add Action Container */}
              <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                <span className="text-2xl font-black text-amber-500">
                  ${product.price ? Number(product.price).toFixed(2) : "0.00"}
                </span>

                <button
                  type="button"
                  onClick={(e) => handleAddToCartClick(e, product)}
                  className={`font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition duration-200 cursor-pointer flex items-center gap-1.5 ${
                    successBadgeId === product._id
                      ? "bg-emerald-600 text-white scale-95 shadow-lg shadow-emerald-600/20"
                      : "bg-amber-600 text-zinc-950 hover:bg-amber-700 active:scale-95"
                  }`}
                >
                  {successBadgeId === product._id ? (
                    <>
                      <FiCheck size={14} /> Added!
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopMenu;