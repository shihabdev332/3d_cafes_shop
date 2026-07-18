import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCoffee, FiDollarSign, FiShoppingBag, FiUsers, 
  FiTrendingUp, FiLayers, FiActivity, FiRefreshCw, FiArrowRight 
} from 'react-icons/fi';
import gsap from 'gsap';
import API from '../api/axios'; // Axios instance pointing to backend server

const AdminDashboard = () => {
  // Real backend metrics states
  const [stats, setStats] = useState({
    revenue: { value: '$0.00', change: '+0% this week' },
    orders: { value: '0', change: '+0% today' },
    products: { value: '0', change: 'Syncing...' },
    customers: { value: '0', change: '+0 new users' }
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesPerformance, setSalesPerformance] = useState([0, 0, 0, 0, 0, 0, 0]); // Default empty canvas array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);

  // Fetch true dynamic dataset from administrative controller endpoint
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Axios GET request to global dashboard statistics endpoint
      const response = await API.get('/admin/dashboard');
      const { data } = response;

      if (data?.success) {
        setStats({
          revenue: { 
            value: `$${Number(data.stats?.revenue?.value || 0).toFixed(2)}`, 
            change: data.stats?.revenue?.change || '+0% this week' 
          },
          orders: { 
            value: String(data.stats?.orders?.value || 0), 
            change: data.stats?.orders?.change || '+0% today' 
          },
          products: { 
            value: String(data.stats?.products?.value || 0), 
            change: data.stats?.products?.change || 'Active' 
          },
          customers: { 
            value: String(data.stats?.customers?.value || 0), 
            change: data.stats?.customers?.change || '+0 new users' 
          }
        });
        
        setRecentOrders(data.recentOrders || []);
        setSalesPerformance(data.salesPerformance || [10, 30, 20, 60, 40, 80, 100]); // Fallback array if empty
      } else {
        throw new Error('Data formulation mismatch from workspace server.');
      }
    } catch (err) {
      console.error('Dashboard Engine Error:', err);
      setError(err.response?.data?.message || 'Failed to establish connection with server logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // GSAP Entrance Multi-stagger Pipeline
  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power4.out', stagger: 0.08 }
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          <FiCoffee className="absolute text-amber-500 animate-pulse" size={16} />
        </div>
        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase font-bold mt-2">Syncing Dashboard Grid</p>
      </div>
    );
  }

  const statsConfig = [
    { id: 1, name: 'Total Revenue', value: stats.revenue.value, change: stats.revenue.change, icon: FiDollarSign, color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10', border: 'hover:border-emerald-500/30' },
    { id: 2, name: 'Total Orders', value: stats.orders.value, change: stats.orders.change, icon: FiShoppingBag, color: 'text-amber-500 bg-amber-500/5 border-amber-500/10', border: 'hover:border-amber-500/30' },
    { id: 3, name: 'Total Products', value: stats.products.value, change: stats.products.change, icon: FiCoffee, color: 'text-blue-400 bg-blue-500/5 border-blue-500/10', border: 'hover:border-blue-400/30' },
    { id: 4, name: 'Total Customers', value: stats.customers.value, change: stats.customers.change, icon: FiUsers, color: 'text-purple-400 bg-purple-500/5 border-purple-500/10', border: 'hover:border-purple-400/30' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-zinc-950 text-white pt-36 pb-20 px-4 md:px-12 max-w-7xl mx-auto selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Top Header Workspace Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-zinc-900 pb-8">
        <div>
          <span className="text-xs font-bold tracking-[6px] text-amber-500 uppercase block mb-2">Management Workspace</span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-100">ADMIN DASHBOARD</h1>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-5 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition cursor-pointer backdrop-blur-md"
        >
          <FiRefreshCw size={12} /> Refresh Logs
        </button>
      </div>

      {error && (
        <div className="bg-red-500/5 border border-red-500/10 text-red-400 p-4 rounded-xl text-xs font-bold tracking-wide mb-8 text-center uppercase">
          {error}
        </div>
      )}

      {/* Grid Cards Mapping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className={`bg-zinc-900/10 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-black/40 ${stat.border} group`}>
              <div className="flex justify-between items-start mb-5">
                <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">{stat.name}</span>
                <div className={`p-2.5 rounded-xl border shadow-inner transition-colors duration-300 ${stat.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-3xl font-black tracking-tight mb-2 text-zinc-100 group-hover:text-white transition-colors">{stat.value}</div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                <FiTrendingUp className="text-emerald-500" size={14} />
                <span className="font-light">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Core Business Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Control Column */}
        <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 space-y-6 shadow-lg shadow-black/40 lg:sticky lg:top-32">
          <div>
            <h2 className="text-base font-black text-amber-500 uppercase tracking-wider flex items-center gap-2">
              <FiLayers size={16} /> Quick Controls
            </h2>
            <p className="text-xs text-zinc-500 font-light mt-1">Direct system routing anchors.</p>
          </div>
          
          <div className="space-y-3">
            <Link to="/admin/products" className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 hover:border-amber-500/30 hover:bg-zinc-900/40 transition-all duration-300 group">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-300 group-hover:text-amber-400 transition-colors">Manage Products</span>
                <span className="text-[11px] text-zinc-500 font-light mt-0.5">Product catalogs, schemas and price models</span>
              </div>
              <FiArrowRight className="text-zinc-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" size={16} />
            </Link>

            <Link to="/admin/orders" className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 hover:border-amber-500/30 hover:bg-zinc-900/40 transition-all duration-300 group">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-300 group-hover:text-amber-400 transition-colors">Manage Orders</span>
                <span className="text-[11px] text-zinc-500 font-light mt-0.5">Track live logistics milestone operations</span>
              </div>
              <FiArrowRight className="text-zinc-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" size={16} />
            </Link>
          </div>
        </div>

        {/* Analytical Charts and Streams Panel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Live Performance Vector Chart */}
          <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between min-h-[280px] shadow-lg shadow-black/40">
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-base font-black text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <FiActivity size={16} className="text-amber-500" /> Sales Performance
                </h2>
                <span className="text-[9px] font-black tracking-widest text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-md bg-zinc-950 uppercase">Live Registry</span>
              </div>
              <p className="text-xs text-zinc-500 font-light mt-1">Real-time database point-of-sale monitor.</p>
            </div>
            
            <div className="w-full h-32 flex items-end justify-between gap-3 pt-6">
              {salesPerformance.map((height, i) => (
                <div key={i} className="flex-1 bg-zinc-950/40 rounded-t-xl h-full flex items-end border border-zinc-900/40 overflow-hidden">
                  <div 
                    style={{ height: `${Math.max(5, Math.min(height, 100))}%` }} 
                    className="w-full bg-gradient-to-t from-amber-600/60 to-amber-500 rounded-t-lg hover:from-amber-500 hover:to-amber-400 transition-all duration-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] relative group cursor-pointer"
                  >
                    <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-[10px] text-amber-500 font-mono font-bold px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl">
                      {height}% Capacity
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Order Monitoring Board */}
          <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 shadow-lg shadow-black/40">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Recent Incoming Logs</h3>
            <div className="divide-y divide-zinc-900/60">
              {recentOrders.map((order) => (
                <div key={order._id} className="py-4 flex flex-row items-center justify-between gap-4 first:pt-0 last:pb-0 group">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-zinc-950 text-amber-500/80 border border-zinc-900 px-2 py-0.5 rounded-md">
                      #{order._id?.slice(-6).toUpperCase()}
                    </span>
                    <h4 className="text-sm font-bold text-zinc-200 mt-2 group-hover:text-white transition-colors">
                      {order.user?.name || 'Guest User'}
                    </h4>
                    <p className="text-xs text-zinc-500 font-light mt-0.5">
                      {order.items?.map(i => `${i.product?.name || 'Blend'} x${i.quantity}`).join(', ') || 'Coffee item'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2.5">
                    <span className="text-sm font-black text-zinc-100 font-mono">
                      ${Number(order.totalPrice || order.totalAmount || 0).toFixed(2)}
                    </span>
                    <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full border uppercase ${
                      order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      order.status === 'Preparing' || order.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}

              {recentOrders.length === 0 && (
                <p className="text-center py-6 text-xs text-zinc-600 font-light">No recent incoming logs found.</p>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;