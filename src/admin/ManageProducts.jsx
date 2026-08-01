import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { deleteProduct } from '../api/adminService';
import { FiUploadCloud, FiTrash2, FiEdit3, FiSearch, FiCheckCircle, FiXCircle, FiCoffee } from 'react-icons/fi';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Filtering and Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  // Storing raw file objects for backend upload
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  const [originalImages, setOriginalImages] = useState([]);

  // Form State with Multi-Image Capabilities
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Coffee',
    description: '',
    images: ['', '', '', ''],
    inStock: true
  });

  const fetchProducts = async () => {
    try {
      const response = await API.get('/shop/menu');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle local file selection and generate preview
  const handleFileChange = (e, slotIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedFiles = [...imageFiles];
    updatedFiles[slotIndex] = file;
    setImageFiles(updatedFiles);

    const updatedPreviews = [...formData.images];
    updatedPreviews[slotIndex] = URL.createObjectURL(file);
    setFormData({ ...formData, images: updatedPreviews });
  };

  const clearImageSlot = (slotIndex) => {
    const updatedPreviews = [...formData.images];
    updatedPreviews[slotIndex] = '';
    setFormData({ ...formData, images: updatedPreviews });

    const updatedFiles = [...imageFiles];
    updatedFiles[slotIndex] = null;
    setImageFiles(updatedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('price', formData.price);
    submissionData.append('category', formData.category);
    submissionData.append('description', formData.description);
    submissionData.append('inStock', formData.inStock);

    if (editingId) {
      const retainedImages = new Set(formData.images.filter((image) => originalImages.includes(image)));
      const removedImages = originalImages.filter((image) => !retainedImages.has(image));
      submissionData.append('removedImages', JSON.stringify(removedImages));
    }

    imageFiles.forEach((file) => {
      if (file) {
        submissionData.append('images', file);
      }
    });

    try {
      if (editingId) {
        await API.put(`/admin/products/${editingId}`, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product updated successfully!');
      } else {
        await API.post('/admin/products', submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product uploaded successfully!');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Upload failed:', err);
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    
    const dbImages = product.images || (product.image ? [product.image] : []);
    const syncImages = Array(4).fill('').map((_, idx) => dbImages[idx] || '');

    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || '',
      images: syncImages,
      inStock: product.inStock !== undefined ? product.inStock : true
    });
    
    setImageFiles([null, null, null, null]);
    setOriginalImages(dbImages);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        alert('Product deleted successfully.');
        fetchProducts();
      } catch (error) {
        alert(error.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: 'Coffee', description: '', images: ['', '', '', ''], inStock: true });
    setImageFiles([null, null, null, null]);
    setOriginalImages([]);
    setEditingId(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'All' || product.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-36 md:pt-40 lg:pt-44 pb-12 px-4 md:px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
      
      {/* Management Control Input View Form */}
      <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-900 rounded-3xl p-5 md:p-6 h-fit shadow-xl shadow-black/40">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
            <FiCoffee size={20} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-zinc-100">
            {editingId ? 'Modify Product' : 'Add New Product'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 focus:outline-none focus:border-amber-500 text-sm text-zinc-100 transition" placeholder="e.g. Organic Matcha Latte" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Price ($)</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 focus:outline-none focus:border-amber-500 text-sm text-zinc-100 transition" placeholder="0.00" required />
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 focus:outline-none focus:border-amber-500 text-sm text-zinc-300 transition">
                <option value="Coffee">Coffee</option>
                <option value="Tea">Tea</option>
                <option value="Bakery">Bakery</option>
                <option value="Dessert">Dessert</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
          </div>

          {/* Improved Image Upload Grid */}
          <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-2xl">
            <label className="block mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Product Images (Up to 4)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((slotIndex) => (
                <div key={slotIndex} className="relative aspect-square border-2 border-dashed border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40 hover:border-amber-500/50 transition group flex flex-col items-center justify-center">
                  {formData.images[slotIndex] ? (
                    <>
                      <img src={formData.images[slotIndex]} alt={`Slot ${slotIndex + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => clearImageSlot(slotIndex)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-400">
                        <FiTrash2 size={24} />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-2 text-center text-zinc-600 hover:text-amber-500 transition">
                      <FiUploadCloud size={20} className="mb-1" />
                      <span className="text-[10px] font-medium leading-tight">Upload<br/>Image {slotIndex + 1}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, slotIndex)} />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 focus:outline-none focus:border-amber-500 text-sm text-zinc-100 transition resize-none" placeholder="Enter specifications..."></textarea>
          </div>

          <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-900">
            <label className="flex items-center gap-2.5 cursor-pointer select-none w-max">
              <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-4 h-4 accent-amber-500 cursor-pointer" />
              <span className="text-sm font-semibold text-zinc-300">Product is In Stock</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black p-3 rounded-xl font-bold transition shadow-lg shadow-amber-500/5">
              {loading ? 'Processing...' : editingId ? 'Update Product' : 'Publish Product'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-3 rounded-xl text-sm transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filterable Product Inventory Matrix */}
      <div className="lg:col-span-2 flex flex-col bg-zinc-900/20 backdrop-blur-xl border border-zinc-900 rounded-3xl p-5 md:p-6 shadow-xl shadow-black/40 h-fit overflow-hidden w-full">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-black text-zinc-100 tracking-tight">Product Inventory</h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-500" size={16} />
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-zinc-200 transition" />
            </div>

            <select value={activeCategoryFilter} onChange={(e) => setActiveCategoryFilter(e.target.value)} className="w-full sm:w-auto p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-400 font-bold focus:outline-none">
              <option value="All">All Categories</option>
              <option value="Coffee">Coffee</option>
              <option value="Tea">Tea</option>
              <option value="Bakery">Bakery</option>
              <option value="Dessert">Dessert</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>
        </div>

        {/* Scrollable Responsive Table Layout */}
        <div className="overflow-x-auto w-full block">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Image</th>
                <th className="pb-3">Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60 text-xs">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-zinc-900/30 transition group">
                  <td className="py-3.5 pl-2">
                    <img src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://placehold.co/100')} alt="" className="w-11 h-11 object-cover rounded-xl border border-zinc-800 shadow-inner group-hover:border-zinc-700 transition" onError={(e) => { e.target.src = 'https://placehold.co/100'; }} />
                  </td>
                  <td className="py-3.5 font-bold text-zinc-200">{product.name}</td>
                  <td className="py-3.5 text-zinc-500 font-medium">{product.category}</td>
                  <td className="py-3.5 font-bold text-amber-500">${product.price}</td>
                  <td className="py-3.5">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {product.inStock !== false ? (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10"><FiCheckCircle /> IN STOCK</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-red-400 bg-red-500/5 px-2 py-0.5 rounded-md border border-red-500/10"><FiXCircle /> OUT OF STOCK</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 text-zinc-400 hover:text-amber-500 bg-zinc-950 border border-zinc-900 rounded-lg hover:border-amber-500/30 transition">
                        <FiEdit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-zinc-500 hover:text-red-400 bg-zinc-950 border border-zinc-900 rounded-lg hover:border-red-500/30 transition">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-zinc-600 font-medium tracking-wide">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageProducts;
