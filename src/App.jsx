import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Regular Imports
import Navbar from "./page/Navbar";
import Hero from "./page/Hero";
import MenuCarousel from "./page/MenuCarousel";
import PromoSection from "./page/PromoSection";
import Area from "./page/Area";
import PromoCards from "./page/PromoCards";
import Footer from "./page/Footer"; 
import SpecialFeature from "./page/SpecialFeature";
import Careers from "./page/Careers";
import PrivateDining from "./page/PrivateDining";
import CartPage from "./component/Cart";
import Blog from "./component/Blog";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ShopMenu from "./pages/ShopMenu";
import Contact from "./component/Contact";
import ProductDetails from "./component/ProductDetails";
import Profile from "./page/Profile";
import Order from "./component/Order"; // আপনার প্রিমিয়াম অর্ডার ফাইলটি

// Lazy Loaded Admin Components
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const ManageProducts = lazy(() => import("./admin/ManageProducts"));
const ManageOrders = lazy(() => import("./admin/ManageOrders"));
const Admin3DModel = lazy(() => import("./admin/ThreeDModel"));

// Admin Route Guard
const AdminLayout = () => {
  const userRole = localStorage.getItem("role") || "customer";
  return userRole === "admin" ? <Outlet /> : <Navigate to="/profile" replace />;
};

// Customer Route Guard (নতুন যোগ করা হয়েছে)
const ProtectedLayout = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

const AppContent = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cafeCartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cafeCartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    const productId = product._id || product.id;
    setCartItems((prevItems) => {
      const isItemExist = prevItems.find((item) => (item._id || item.id) === productId);
      if (isItemExist) {
        return prevItems.map((item) =>
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col justify-between text-white selection:bg-amber-500 selection:text-black">
      <div>
        <Navbar cartCount={totalCartCount} />

        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-amber-500">Loading Workspace...</div>}>
          <Routes>
            {/* 1. Open Public Routes */}
            <Route path="/" element={<><Hero /><SpecialFeature /><MenuCarousel /><PromoSection /><Area /><PromoCards /></>} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/menu" element={<ShopMenu onAddToCart={handleAddToCart} />} />
            <Route path="/product/:id" element={<ProductDetails onAddToCart={handleAddToCart} />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/private-dining" element={<PrivateDining />} />
            <Route path="/cart" element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />

            {/* 2. Protected Customer Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Order />} /> 
            </Route>

            {/* 3. Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="3d-model" element={<Admin3DModel />} />
            </Route>

            <Route path="/admin/*" element={<Navigate to="/profile" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;