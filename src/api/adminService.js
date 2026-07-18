import API from './axios';

// Create a new product (Admin only)
export const createProduct = async (productData) => {
  try {
    const response = await API.post('/admin/products', productData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Product upload failed');
  }
};

// Update an existing product by ID (Admin only)
export const updateProduct = async (id, productData) => {
  try {
    const response = await API.put(`/admin/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Product update failed');
  }
};

// Delete a product by ID (Admin only)
export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Product deletion failed');
  }
};