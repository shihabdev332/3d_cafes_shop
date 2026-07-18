import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth and Cart states
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('role'));
  const [cartCount, setCartCount] = useState(0);

  const menuRef = useRef(null);
  const navRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Function to calculate and update cart item count
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(totalItems);
  };

  // Sync auth and cart state on route change or custom events
  useEffect(() => {
    const currentRole = localStorage.getItem('role');
    setRole(currentRole);
    setIsLoggedIn(!!currentRole);
    updateCartCount();

    // Listen for storage or custom cart updates from other components
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, [location]);

  const logoUrl = "https://res.cloudinary.com/didqmq9xz/image/upload/v1780860817/b513a063-1f67-4444-8ed8-6b807c3f886e_cw8ssq.png";

  // Entry animation for navbar
  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -120, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
    );
  }, []);

  // Slide animation for mobile drawer
  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.to(menuRef.current, { x: 0, duration: 0.5, ease: 'power4.out' });
    } else {
      gsap.to(menuRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
    }
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    setRole(null);
    setIsLoggedIn(false);
    setCartCount(0);
    closeMenu();
    navigate('/signin');
  };

  return (
    <>
      {/* HEADER SECTION */}
      <header className="fixed w-full top-0 z-[100] bg-[#1a1a1a]" ref={navRef}>
        <div className="bg-[#fcd34d] text-black text-center text-[10px] md:text-xs font-bold py-2.5 tracking-[0.2em] uppercase px-4">
          GET EXCLUSIVE UPDATES: <a href="#text" className="underline font-bold border-black pb-[1px]">LET'S TEXT</a>
        </div>

        <nav className="flex justify-between items-center px-6 md:px-12 py-5 lg:py-6 text-white border-b border-white/5">
          
          {/* Logo */}
          <Link to="/" className="cursor-pointer block">
            <img 
              src={logoUrl} 
              alt="Cactus Club Cafe Logo" 
              className="h-8 md:h-12 lg:h-20 w-auto object-cover brightness-100"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center  gap-8 space-x-8 text-[11px] tracking-[0.15em] uppercase font-semibold">
            <Link to="/menu" className="hover:text-amber-400 transition-colors">Menus</Link>
            
          
             <Link to="/careers" className="hover:text-amber-400 transition-colors">Careers</Link>
            <Link to="/private-dining" className="hover:text-amber-400 transition-colors">Private Dining</Link>
             <Link to="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
              <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
              <Link to="/orders" className="hover:text-amber-400 transition-colors">My Orders</Link>
          </div>

          

          {/* Desktop Right Actions (Cart, Profile, Auth) */}
          <div className="hidden lg:flex items-center space-x-6">
            
            {/* Functional Cart Icon Badge */}
            <Link to="/cart" className="relative p-2 text-white hover:text-amber-500 transition-colors group">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md shadow-amber-500/20">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <>
                {role === 'admin' ? (
                  <Link to="/admin/dashboard" className="text-[11px] tracking-[0.15em] uppercase font-semibold text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1.5 border border-amber-500/30 px-3 py-1.5 rounded-lg bg-amber-500/5">
                    <FiUser size={14} /> ADMIN PANEL
                  </Link>
                ) : (
                  <Link to="/profile" className="text-[11px] tracking-[0.15em] uppercase font-semibold text-zinc-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 hover:border-amber-500/30 px-3 py-1.5 border border-transparent rounded-lg transition-all">
                    <FiUser size={16} className="text-amber-500" /> MY PROFILE
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="border border-red-500/30 px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-semibold text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                >
                  LOG OUT
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-[11px] tracking-[0.15em] uppercase font-semibold hover:text-gray-400 transition-colors px-2">
                  SIGN IN
                </Link>
                <Link to="/signup" className="border border-white/70 px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-semibold hover:bg-white hover:text-black transition-all duration-300">
                  SIGN UP
                </Link>
              </>
            )}
            
            <Link to="/order" className="border border-amber-500 bg-amber-500 text-black px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-transparent hover:text-white transition-all duration-300">
              ORDER 
            </Link>
          </div>

          {/* Mobile Menu Actions */}
          <div className="lg:hidden flex items-center space-x-4 text-white">
            <Link to="/cart" className="relative p-2 text-white hover:text-amber-500 transition-colors">
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="cursor-pointer" onClick={() => setIsMobileMenuOpen(true)}>
              <FiMenu size={28} />
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU DRAWER */}
      <div 
        ref={menuRef}
        className="fixed inset-y-0 right-0 w-full md:w-[380px] bg-[#1a1a1a] flex flex-col pt-24 pb-12 px-10 transform translate-x-full z-[110] border-l border-white/10"
      >
        <div className="absolute top-8 right-8 cursor-pointer" onClick={closeMenu}>
          <FiX size={32} className="text-white hover:text-gray-400 transition-colors" />
        </div>
        
        {/* Mobile Links */}
        <div className="flex flex-col space-y-6 text-center text-sm font-light tracking-[0.2em] uppercase text-white mt-10">
          <Link to="/menu" onClick={closeMenu} className="hover:text-gray-400 transition-colors">MENUS</Link>

         
          <Link to="/careers" className="hover:text-amber-400 transition-colors">Careers</Link>
          <Link to="/cart" onClick={closeMenu} className="hover:text-amber-400 transition-colors text-zinc-300 flex items-center justify-center gap-2">
          
            MY CART ({cartCount})
          </Link>
          <Link to="/private-dining" className="hover:text-amber-400 transition-colors">Private Dining</Link>
             <Link to="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>

              <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
              <Link to="/my-orders" className="hover:text-amber-400 transition-colors">My Orders</Link>
          
          {isLoggedIn && (
            role === 'admin' ? (
              <Link to="/admin/dashboard" onClick={closeMenu} className="hover:text-amber-400 transition-colors text-amber-500 font-semibold">ADMIN PANEL</Link>
            ) : (
              <Link to="/profile" onClick={closeMenu} className="hover:text-amber-400 transition-colors text-amber-500 font-semibold">MY PROFILE</Link>
            )
          )}
        </div>

        {/* Mobile Bottom Buttons */}
        <div className="flex flex-col space-y-4 w-full mt-auto mb-10">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="border border-red-500/50 text-red-400 py-4 text-center text-xs tracking-[0.15em] uppercase hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
            >
              LOG OUT
            </button>
          ) : (
            <>
              <Link to="/signin" onClick={closeMenu} className="border border-white/50 text-white py-4 text-center text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all">
                SIGN IN
              </Link>
              <Link to="/signup" onClick={closeMenu} className="border border-white/50 text-white py-4 text-center text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all">
                SIGN UP
              </Link>
            </>
          )}
          <Link to="/order" onClick={closeMenu} className="border border-amber-500 bg-amber-500 text-black py-4 text-center text-xs font-bold tracking-[0.15em] uppercase hover:bg-transparent hover:text-white transition-all">
            ORDER
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;