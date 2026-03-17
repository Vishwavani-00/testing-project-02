import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE });

export const runQuery = async (question) => {
  const res = await api.post('/api/query/', { question });
  return res.data;
};

export const getHistory = async (limit = 20) => {
  const res = await api.get(`/api/history/?limit=${limit}`);
  return res.data;
};

export const clearHistory = async () => {
  const res = await api.delete('/api/history/');
  return res.data;
};

export const getSchema = async () => {
  const res = await api.get('/api/schema/');
  return res.data;
};
