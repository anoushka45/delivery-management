import axios from 'axios';

const api = axios.create({
  baseURL: 'https://delivery-management-q80j.onrender.com', // Backend server address
});

// Fetch orders
export const fetchOrders = async () => {
  const response = await api.get('/api/orders');
  return response.data;
};

// Fetch partners
export const fetchPartners = async () => {
  const response = await api.get('/api/partners');
  return response.data;
};

// Fetch assignment metrics
export const fetchAssignmentsMetrics = async () => {
  const response = await api.get('/api/assignments/metrics');
  return response.data;
};

export const fetchAssignments = async () => {
  const response = await api.get('/api/assignments');
  return response.data;
};

export default api;
