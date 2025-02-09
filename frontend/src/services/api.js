import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

export const uploadReport = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/reports/upload', formData);
    return response.data;
};

export const getReport = async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
};

export const getAllReports = async () => {
    const response = await api.get('/reports');
    return response.data;
};
