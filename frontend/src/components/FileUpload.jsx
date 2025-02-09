import React, { useState } from 'react';
import { Button, Box, Alert } from '@mui/material';
import { useReport } from '../context/ReportContext';

const FileUpload = () => {
    const [error, setError] = useState(null);
    const { uploadReport, loading } = useReport();

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const isXml = file.type === 'application/xml' || file.name.toLowerCase().endsWith('.xml');
        if (!isXml) {
            setError('Please select a valid XML file');
            return;
        }

        try {
            await uploadReport(file);
            setError(null);
            event.target.value = null; // Clear the file input
        } catch (err) {
            setError(err.message || 'Failed to upload file');
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <input
                accept=".xml,application/xml"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileUpload}
                disabled={loading}
            />
            <label htmlFor="raised-button-file">
                <Button
                    variant="contained"
                    component="span"
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Upload XML Report'}
                </Button>
            </label>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default FileUpload;
