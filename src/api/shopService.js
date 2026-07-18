import API from './axios';

// Fetch all shop menu items
export const getShopMenu = async () => {
  try {
    // সঠিক মেনু এন্ডপয়েন্ট
    const response = await API.get('/shop/menu');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch menu');
  }
};

// Fetch single product details by ID
export const getProductDetails = async (id) => {
  try {
    // সঠিক প্রোডাক্ট ডিটেইলস এন্ডপয়েন্ট (ব্যাকএন্ড রাউটের সাথে মিল রেখে)
    const response = await API.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch product details');
  }
};