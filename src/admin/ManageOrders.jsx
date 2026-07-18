import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { FiTrendingUp, FiMapPin, FiClock } from 'react-icons/fi';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders for admin
  const fetchOrders = async () => {
    try {
      const response = await API.get('/admin/orders'); 
      setOrders(response.data.orders || response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status based on updated schema flow
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // ব্যাকএন্ড কন্ট্রোলার অনুযায়ী এপিআই ইউআরএল এবং ডাটা স্ট্রাকচার
      await API.put(`/admin/orders/${orderId}`, { status: newStatus });
      alert(`Order marked as ${newStatus}!`);
      fetchOrders(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Status badge styling helper updated with new milestones
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'confirmed': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'preparing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'out for delivery': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 max-w-7xl mx-auto">
      {/* Control Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold tracking-[5px] text-amber-500 uppercase block mb-1">Workspace</span>
          <h2 className="text-3xl md:text-4xl font-black text-zinc-100 tracking-tight">MANAGE ORDERS</h2>
        </div>
        <span className="text-sm bg-zinc-900 border border-zinc-800 px-5 py-2.5 rounded-xl text-zinc-400 font-medium flex items-center gap-2">
          <FiTrendingUp className="text-amber-500" /> Total Received: {orders.length}
        </span>
      </div>

      {/* Grid Canvas / Table Workspace */}
      <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 overflow-x-auto shadow-2xl">
        {loading ? (
          <div className="text-center py-12 text-zinc-500 text-sm font-medium flex items-center justify-center gap-2">
            <FiClock className="animate-spin text-amber-500" size={16} /> Loading live coffee logs...
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wider font-bold">
                <th className="pb-4 pl-2">ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Blends</th>
                <th className="pb-4">Destination</th>
                <th className="pb-4">Total</th>
                <th className="pb-4">Milestone</th>
                <th className="pb-4 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50 text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-zinc-900/30 transition duration-150 group">
                  {/* Order ID */}
                  <td className="py-4 pl-2 font-mono text-xs text-zinc-600 group-hover:text-zinc-400 transition">
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>
                  
                  {/* Customer Meta */}
                  <td className="py-4">
                    <div className="font-bold text-zinc-200">{order.user?.name || 'Guest User'}</div>
                    <div className="text-xs text-zinc-500 font-light">{order.user?.email || 'N/A'}</div>
                  </td>
                  
                  {/* Items Order Matrix */}
                  <td className="py-4 text-zinc-300">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="text-xs font-medium py-0.5">
                        {item.product?.name || 'Premium Blend'}{' '}
                        <span className="text-amber-500/80 font-mono font-bold">x{item.quantity}</span>
                      </div>
                    )) || <span className="text-zinc-600">No Items</span>}
                  </td>
                  
                  {/* Delivery Location Address */}
                  <td className="py-4 max-w-[180px]">
                    <div className="flex items-start gap-1.5 text-xs text-zinc-400 font-light line-clamp-2">
                      <FiMapPin className="text-zinc-600 shrink-0 mt-0.5" size={12} />
                      <span>{order.location || 'In-shop Pickup'}</span>
                    </div>
                  </td>
                  
                  {/* Price */}
                  <td className="py-4 font-black text-amber-500 font-mono">
                    ${Number(order.totalPrice || order.totalAmount || 0).toFixed(2)}
                  </td>
                  
                  {/* Live Milestone Status */}
                  <td className="py-4">
                    <span className={`text-[10px] border px-2.5 py-1 rounded-full uppercase font-black tracking-widest ${getStatusClass(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  
                  {/* Action Selector */}
                  <td className="py-4 text-right pr-2">
                    <select
                      value={order.status || 'Pending'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-amber-500/50 transition cursor-pointer hover:border-zinc-700"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-zinc-600 font-light text-sm">
                    No logs found in the global coffee registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;