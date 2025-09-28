import axios from 'axios';
import { LoginFormData, RegisterFormData } from '../types/auth_types';
import { BASE_URL } from '@/config/url';


export const loginUser = async (data: LoginFormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/token/`, data);
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    return { success: true, is_admin: res.data.is_admin };
  } catch (err: any) {
    return { success: false, message: err.response?.data || 'Login failed' };
  }
};

export const registerUser = async (data: RegisterFormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/register/`, data);
    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data || 'Registration failed' };
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};