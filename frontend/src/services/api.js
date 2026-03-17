import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000' });

export const runQuery = (question) => api.post('/api/query/', { question }).then(r => r.data);
export const getHistory = (limit = 20) => api.get(`/api/history/?limit=${limit}`).then(r => r.data);
export const clearHistory = () => api.delete('/api/history/').then(r => r.data);
export const getSchema = () => api.get('/api/schema/').then(r => r.data);
