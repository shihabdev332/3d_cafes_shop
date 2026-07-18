import React, { useState, useEffect, useRef } from 'react';
import { FiCoffee, FiMapPin, FiClock, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import gsap from 'gsap';
import API from '../api/axios'; // Axios instance pointing to backend server

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Fetch logged-in user's orders from backend registry
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      // Endpoint maps to getUserOrders controller in backend
      const response = await API.get('/orders/user'); 
      setOrders(response.data.orders || response.data || []);
    } catch (err) {
      console.error('Fetch Orders Error:', err);
      setError(err.response?.data?.message || 'Failed to sync your order logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  // GSAP Premium Cascading Entrance Transition
  useEffect(() => {
    if (!loading && containerRef.current && orders.length > 0) {
      gsap.fromTo(containerRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', stagger: 0.1 }
      );
    }
  }, [loading, orders]);

  // Helper to determine active index for milestone tracking line
  const getStatusStep = (status) => {
    const milestones = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Completed'];
    return milestones.indexOf(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-bold">Syncing Coffee Trackers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 pb-20 px-4 md:px-8 max-w-5xl mx-auto selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Dynamic Upper Header Layout */}
      <div className="border-b border-zinc-900 pb-6 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold tracking-[5px] text-amber-500 uppercase block mb-1">Customer Hub</span>
          <h1 className="text-3xl font-black tracking-tight text-zinc-100">MY ORDERS</h1>
        </div>
        <div className="text-xs text-zinc-400 font-medium bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl backdrop-blur-md">
          Active Logs: {orders.length}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/5 border border-red-500/10 text-red-400 p-4 rounded-xl text-xs font-bold tracking-wide uppercase text-center mb-8">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-2xl p-8 backdrop-blur-sm">
          <FiCoffee className="text-zinc-700 mx-auto mb-4" size={40} />
          <h3 className="text-base font-bold text-zinc-400">No Orders Dispatched</h3>
          <p className="text-xs text-zinc-600 mt-1 font-light">Your global coffee log is currently empty.</p>
        </div>
      ) : (
        /* Flow Container Mapping Matrix */
        <div ref={containerRef} className="space-y-8">
          {orders.map((order) => {
            const currentStep = getStatusStep(order.status);
            const isCancelled = order.status === 'Cancelled';

            return (
              <div key={order._id} className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 shadow-xl shadow-black/30 transition-all duration-300 hover:border-zinc-800">
                
                {/* Micro Header Meta Fields */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-zinc-950 text-amber-500/80 border border-zinc-900 px-2 py-0.5 rounded-md uppercase">
                      #{order._id?.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-xs text-zinc-500 font-light ml-3">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 font-light">Total Paid:</span>
                    <span className="text-base font-black text-amber-500 font-mono">${Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                </div>

                {/* Main Node Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-6">
                  
                  {/* Left Sector: Item Matrices */}
                  <div className="lg:col-span-2 space-y-3">
                    <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase block mb-1">Items Summary</span>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-zinc-950/40 border border-zinc-900/50 p-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/5 border border-amber-500/10 rounded-lg text-amber-500">
                            <FiCoffee size={14} />
                          </div>
                          <span className="text-sm font-bold text-zinc-200">{item.product?.name || 'Premium Blend'}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-zinc-500">
                          Qty: <span className="text-zinc-300">x{item.quantity}</span>
                        </span>
                      </div>
                    ))}

                    {/* Target Logistics Address */}
                    <div className="mt-4 pt-2 flex items-start gap-2 text-xs text-zinc-400 font-light">
                      <FiMapPin className="text-zinc-600 shrink-0 mt-0.5" size={13} />
                      <span>Delivery Hub: {order.location}</span>
                    </div>
                  </div>

                  {/* Right Sector: Status Card Badging */}
                  <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex flex-col justify-between h-full min-h-[110px]">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase block mb-2">Milestone Status</span>
                      <span className={`text-[10px] font-black tracking-widest px-3 py-1 border rounded-full uppercase ${
                        isCancelled ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 font-light flex items-center gap-1.5 mt-4">
                      <FiClock size={12} className="text-zinc-600" />
                      <span>Payment via {order.paymentMethod || 'Cash on Delivery'}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Workflow Timeline Visualizer */}
                {!isCancelled && (
                  <div className="mt-8 pt-4 border-t border-zinc-900/60 hidden sm:block">
                    <div className="relative w-full flex justify-between items-center">
                      
                      {/* Interactive Progress Tracking Line Vector */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-zinc-900 w-full z-0"></div>
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-amber-600 to-amber-500 z-0 transition-all duration-500"
                        style={{ width: `${currentStep >= 0 ? (currentStep / 4) * 100 : 0}%` }}
                      ></div>

                      {/* Milestone Checkpoints */}
                      {['Ordered', 'Confirmed', 'Preparing', 'Shipped', 'Delivered'].map((node, stepIdx) => {
                        const isPassed = currentStep >= stepIdx;
                        const isCurrent = currentStep === stepIdx;

                        return (
                          <div key={stepIdx} className="relative z-10 flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] transition-all duration-300 ${
                              isPassed 
                                ? 'bg-amber-500 border-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] font-black' 
                                : 'bg-zinc-950 border-zinc-800 text-zinc-600 font-medium'
                            }`}>
                              {isPassed && !isCurrent ? <FiCheckCircle size={12} className="stroke-[3]" /> : stepIdx + 1}
                            </div>
                            <span className={`text-[10px] uppercase font-bold tracking-wider mt-2.5 transition-colors ${
                              isCurrent ? 'text-amber-500' : isPassed ? 'text-zinc-400' : 'text-zinc-600'
                            }`}>
                              {node}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;