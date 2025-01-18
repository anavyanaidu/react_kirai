import axios from 'axios';
import { KiraiDetails, LoginResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8009',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const saveKiraiDetails = async (data: KiraiDetails): Promise<KiraiDetails> => {
  const response = await api.post('/v1/kirai/saveKiraiDetails', data);
  return response.data;
};

export const getAllKiraiDetails = async (params: {
  page: number;
  size: number;
}): Promise<KiraiDetails[]> => {
  const response = await api.get('/v1/kirai/getKiraiDetails', { params });
  return response.data;
};

// http://localhost:8009/v1/kirai/getKiraiDetails?page=0&size=10
// http://localhost:8009/v1/kirai/getAllKiraiDetails?page=0&size=10q
