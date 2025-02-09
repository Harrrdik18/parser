import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://parser-production-902f.up.railway.app/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
    const [reports, setReports] = useState([]);
    const [currentReport, setCurrentReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReports = useCallback(async (signal) => {
        setLoading(true);
        try {
            const response = await api.get('/reports', { signal });
            setReports(response.data || []);
            setError(null);
        } catch (err) {
            if (!axios.isCancel(err)) {
                console.error('Error fetching reports:', err);
                setError(err.response?.data?.error || err.message || 'Failed to fetch reports');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        fetchReports(abortController.signal);
        return () => abortController.abort();
    }, [fetchReports]);

    const uploadReport = async (file) => {
        const abortController = new AbortController();
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('xmlFile', file);

        try {
            const response = await api.post('/reports/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                signal: abortController.signal
            });
            await fetchReports();
            setError(null);
            return response.data;
        } catch (err) {
            if (!axios.isCancel(err)) {
                const errorMessage = err.response?.data?.error || err.message || 'Failed to upload report';
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const getReport = useCallback(async (id) => {
        const abortController = new AbortController();
        setLoading(true);
        setError(null);
        
        try {
            const response = await api.get(`/reports/${id}`, {
                signal: abortController.signal
            });
            setCurrentReport(response.data);
            setError(null);
            return response.data;
        } catch (err) {
            if (!axios.isCancel(err)) {
                const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch report';
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        } finally {
            setLoading(false);
        }

        return () => {
            abortController.abort();
        };
    }, []);

    const clearCurrentReport = useCallback(() => {
        setCurrentReport(null);
    }, []);

    return (
        <ReportContext.Provider value={{
            reports,
            currentReport,
            loading,
            error,
            uploadReport,
            getReport,
            clearCurrentReport,
            fetchReports
        }}>
            {children}
        </ReportContext.Provider>
    );
};

export const useReport = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error('useReport must be used within a ReportProvider');
    }
    return context;
};
