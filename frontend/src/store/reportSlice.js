import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';

export const uploadReport = createAsyncThunk(
    'reports/upload',
    async (file) => {
        const response = await api.uploadReport(file);
        return response;
    }
);

export const fetchReport = createAsyncThunk(
    'reports/fetchOne',
    async (id) => {
        const response = await api.getReport(id);
        return response;
    }
);

export const fetchAllReports = createAsyncThunk(
    'reports/fetchAll',
    async () => {
        const response = await api.getAllReports();
        return response;
    }
);

const reportSlice = createSlice({
    name: 'reports',
    initialState: {
        reports: [],
        currentReport: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrentReport: (state) => {
            state.currentReport = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadReport.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(uploadReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReport.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReport = action.payload;
            })
            .addCase(fetchReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAllReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchAllReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearCurrentReport } = reportSlice.actions;
export default reportSlice.reducer;
