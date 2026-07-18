import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // Redirect admin to dashboard if they try to access the customer profile
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  // Mock user data - Temporary for UI layout
  const user = {
    name: "Md Shihab",
    email: "shihab@example.com",
    memberSince: "January 2026",
    rewardPoints: 340,
    tier: "Gold Member",
  };

  // Mock recent orders
  const recentOrders = [
    {
      id: "CAF-9832",
      date: "June 25, 2026",
      total: "$14.50",
      status: "In Progress",
    },
    {
      id: "CAF-9711",
      date: "June 18, 2026",
      total: "$22.00",
      status: "Delivered",
    },
  ];

  // Fully functional logout action
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token"); // Clears the auth token
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 max-w-6xl mx-auto pt-45">
      {/* Top Profile Header */}
      <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-3xl font-bold text-black shadow-lg shadow-amber-600/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
              <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2.5 py-1 rounded-full font-medium">
                {user.tier}
              </span>
            </div>
            <p className="text-zinc-400 text-sm mt-1">{user.email}</p>
            <p className="text-zinc-500 text-xs mt-2">
              Member Since: {user.memberSince}
            </p>
          </div>
        </div>

        {/* Loyalty Reward Points Card */}
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5 text-center min-w-[200px]">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            Cafe Rewards
          </p>
          <p className="text-4xl font-extrabold text-amber-500 my-1">
            {user.rewardPoints}
          </p>
          <p className="text-xs text-zinc-500">
            Points available for free coffee
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Premium Quick Actions Navigation */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-amber-500 px-1">
            Quick Navigation
          </h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-3 flex flex-col gap-2">
            <Link
              to="/menu"
              className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 rounded-xl transition group"
            >
              <div className="p-2.5 bg-zinc-800 rounded-lg group-hover:bg-amber-600 group-hover:text-black transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <span className="font-medium">Go to Shop / Menu</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 rounded-xl transition group"
            >
              <div className="p-2.5 bg-zinc-800 rounded-lg group-hover:bg-amber-600 group-hover:text-black transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="font-medium">View My Cart</span>
            </Link>

            <Link
              to="/my-orders"
              className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 rounded-xl transition group"
            >
              <div className="p-2.5 bg-zinc-800 rounded-lg group-hover:bg-amber-600 group-hover:text-black transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <span className="font-medium">Order History</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-3 hover:bg-red-500/10 text-red-400 rounded-xl transition group w-full text-left"
            >
              <div className="p-2.5 bg-zinc-800 rounded-lg group-hover:bg-red-600 group-hover:text-white transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Side: Order Tracking & Profile Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders Card */}
          <div>
            <h2 className="text-xl font-bold text-amber-500 mb-4 px-1">
              Recent Activity
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-800/30 border border-zinc-800 rounded-xl gap-4"
                >
                  <div>
                    <p className="font-semibold text-zinc-200">{order.id}</p>
                    <p className="text-xs text-zinc-500">{order.date}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                    <p className="font-bold text-amber-500">{order.total}</p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        order.status === "In Progress"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-green-500/10 text-green-400 border border-green-500/20"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Sub-sections placeholders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
              <h3 className="font-semibold text-zinc-300 mb-2">
                Delivery Address
              </h3>
              <p className="text-sm text-zinc-500">
                No primary address saved yet. Add one to speed up checkout.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
              <h3 className="font-semibold text-zinc-300 mb-2">
                Payment Methods
              </h3>
              <p className="text-sm text-zinc-500">
                Securely manage your saved credit cards or mobile wallets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
