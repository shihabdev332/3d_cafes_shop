import React, { useState } from "react";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
  FiCheckCircle,
  FiLoader,
  FiMapPin,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; // Axios instance pointing to backend server

const Cart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  // Order placement and form states
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [location, setLocation] = useState("");
  const [orderStatus, setOrderStatus] = useState({ type: "", text: "" });

  // 1. Increment or decrement item quantity
  const handleQuantityChange = (productId, amount) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          const currentId = item.product?._id || item.product || item._id || item.id;
          if (currentId === productId) {
            const newQuantity = item.quantity + amount;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  // 2. Remove item from global cart state
  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => (item.product?._id || item.product || item._id || item.id) !== productId,
      ),
    );
  };

  // 3. Subtotal mathematical calculation
  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.product?.price || item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return acc + price * quantity;
  }, 0);

  // 4. Logistics shipping and total valuation
  const shipping = subtotal > 0 ? 5.0 : 0.0;
  const total = subtotal + shipping;

  // 5. Submit real order payload to backend endpoint
  const handlePlaceOrder = async () => {
    if (!location.trim()) {
      setOrderStatus({
        type: "error",
        text: "Delivery destination address is required!",
      });
      return;
    }

    setIsPlacingOrder(true);
    setOrderStatus({ type: "", text: "" });

    try {
      // Map cart dataset to match exact backend Mongoose Schema requirements
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product?._id || item.product || item._id || item.id,
          quantity: Number(item.quantity),
        })),
        totalPrice: total,
        location: location,
        paymentMethod: "Cash on Delivery",
      };

      // Axios POST request to order creation gateway
      const response = await API.post("/orders", orderPayload);

      if (response.data && response.data.success) {
        setCartItems([]); // Flush client cart cache memory
        setOrderStatus({
          type: "success",
          text: "🎉 ORDER PLACED SUCCESSFULLY!",
        });
      } else {
        throw new Error(response.data?.message || "Failed to confirm order.");
      }
    } catch (error) {
      console.error("Order Submission Error:", error);
      setOrderStatus({
        type: "error",
        text:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to dispatch order payload. Please try again.",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Success Confirmation Screen Visualizer
  if (orderStatus.type === "success") {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-zinc-900/30 border border-emerald-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl backdrop-blur-md">
          <FiCheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black tracking-tight text-zinc-100 mb-2">
            {orderStatus.text}
          </h2>
          <p className="text-zinc-500 text-sm mb-6 font-light leading-relaxed">
            Your premium coffee order has been recorded. You can track its live
            status in your profile dashboard.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-zinc-900 border border-zinc-800 text-amber-500 font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest hover:bg-zinc-800 transition cursor-pointer"
          >
            Track My Orders
          </button>
        </div>
      </div>
    );
  }

  // Fallback Empty Cart Board UI
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl text-amber-500">
          <FiShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-100 mb-2">
          YOUR CART IS EMPTY
        </h2>
        <p className="text-zinc-500 text-sm max-w-sm mb-8 font-light leading-relaxed">
          Looks like you haven't added any premium blends to your cart yet.
          Let's find something delicious!
        </p>
        <button
          onClick={() => navigate("/menu")}
          className="bg-amber-600 text-zinc-950 font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest hover:bg-amber-700 active:scale-95 transition cursor-pointer"
        >
          Explore Premium Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-20 px-4 md:px-12 max-w-7xl mx-auto selection:bg-amber-500 selection:text-zinc-950">
      {/* Title Canopy */}
      <div className="mb-10">
        <span className="text-xs font-bold tracking-[5px] text-amber-500 uppercase block mb-2">
          Selected Blends
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-zinc-100 tracking-tight">
          YOUR CART ({cartItems.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Grid: Streams of Cart Nodes */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const product = item.product || item;
            const productId = product._id || item._id || item.id;
            const itemPrice = Number(product.price) || 0;

            return (
              <div
                key={productId}
                className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-zinc-800 transition duration-300 shadow-xl"
              >
                {/* Meta Visual Frame */}
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <div className="h-20 w-20 rounded-xl overflow-hidden border border-zinc-900 shrink-0 bg-zinc-950">
                    <img
                      src={
                        product.images?.[0] || "https://via.placeholder.com/150"
                      }
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black bg-zinc-950 px-2.5 py-0.5 rounded-md text-zinc-500 border border-zinc-900 tracking-wider">
                      {product.category || "Coffee"}
                    </span>
                    <h3 className="text-base font-bold text-zinc-200 mt-1.5 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-amber-500 font-black font-mono text-sm mt-0.5">
                      ${itemPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Counter Controllers */}
                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-900/60">
                  <div className="flex items-center bg-zinc-950 border border-zinc-900 rounded-xl p-1">
                    {/* Decrement counter item quantity */}
                    <button
                      onClick={() => handleQuantityChange(productId, -1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 transition active:scale-90 cursor-pointer"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-zinc-300 font-mono">
                      {item.quantity}
                    </span>
                    {/* Increment counter item quantity */}
                    <button
                      onClick={() => handleQuantityChange(productId, 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 transition active:scale-90 cursor-pointer"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  {/* Calculations and Removals */}
                  <div className="flex items-center gap-5">
                    <span className="text-base font-black text-zinc-200 font-mono w-20 text-right">
                      ${(itemPrice * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(productId)}
                      className="text-zinc-600 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/5 transition cursor-pointer"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Execution Summary & Form Canvas */}
        <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 lg:sticky lg:top-32 shadow-2xl space-y-6">
          <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">
            Order Summary
          </h2>

          <div className="space-y-4 text-xs font-medium text-zinc-500 pb-6 border-b border-zinc-900">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-zinc-300 font-mono font-bold">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="text-zinc-300 font-mono font-bold">
                ${shipping.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery Location Input Field (Required by Backend Schema) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
              <FiMapPin className="text-amber-500" /> Delivery Address
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your shipping address..."
              className="w-full bg-zinc-950 border border-zinc-900 text-zinc-200 rounded-xl px-4 py-3 text-xs font-medium placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
              Total Amount
            </span>
            <span className="text-2xl font-black text-amber-500 font-mono">
              ${total.toFixed(2)}
            </span>
          </div>

          {orderStatus.type === "error" && (
            <p className="text-red-400 text-[10px] font-bold uppercase text-center bg-red-500/5 border border-red-500/10 py-2.5 rounded-lg tracking-wide">
              {orderStatus.text}
            </p>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full bg-amber-600 text-zinc-950 font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-amber-700 active:scale-95 transition flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-amber-600/10 disabled:opacity-40"
          >
            {isPlacingOrder ? (
              <>
                <FiLoader className="animate-spin" size={12} /> Despatching
                Order...
              </>
            ) : (
              <>
                Confirm Coffee Order
                <FiArrowRight
                  size={13}
                  className="group-hover:translate-x-1 transition-all"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
