import axios from 'axios';
import { DhalariDetails, KiraiDetails, LoginResponse, RiceMill } from '../types';

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

// Add new API calls for autocomplete
export const searchRiceMills = async (query: string) => {
  const response = await api.get(`/v1/kirai/ricemills?search=${query}`);
  return response.data;
};

export const searchDhalaris = async (query: string) => {
  const response = await api.get(`/v1/kirai/dhalaris?search=${query}`); 
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

export const getAllRiceMills = async (search?: string): Promise<RiceMill[]> => {
  const response = await api.get('/v1/kirai/getAllRiceMills');
  return response.data;
};

export const getAllDhalariDetails = async (search?: string): Promise<DhalariDetails[]> => {
  const response = await api.get('/v1/kirai/getAllDhalariDetails');
  return response.data;
};

export const filterKiraiDetails = async (fieldName: string, value: string): Promise<KiraiDetails[]> => {
  const response = await api.get(`/v1/kirai/filter`, {
    params: { fieldName, value }
  });
  return response.data;
};


