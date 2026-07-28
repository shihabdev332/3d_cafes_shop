import API from './axios';

// Fetch all menu items for the shop
export const getShopMenu = async () => {
  try {
    const response = await API.get('/shop/menu');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch menu');
  }
};

// Fetch detailed information for a single product by ID
export const getProductDetails = async (productId) => {
  try {
    const response = await API.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch product details');
  }
};