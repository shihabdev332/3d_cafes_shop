import API from './axios';

export const signupUser = async (userData) => {
  try {
    const response = await API.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Signup failed');
  }
};

export const signinUser = async (credentials) => {
  try {
    const response = await API.post('/auth/signin', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Signin failed');
  }
};