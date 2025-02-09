import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadReport } from '../store/reportSlice';

const FileUpload = () => {
    const dispatch = useDispatch();
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check if file is XML (either by mime type or extension)
        const isXml = file.type === 'application/xml' || 
                     file.type === 'text/xml' ||
                     file.name.toLowerCase().endsWith('.xml');

        if (!isXml) {
            alert('Please select a valid XML file');
            return;
        }

        setUploading(true);
        try {
            const result = await dispatch(uploadReport(file)).unwrap();
            alert('Report uploaded successfully!');
            console.log('Upload result:', result);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading report: ' + (error.message || 'Unknown error'));
        } finally {
            setUploading(false);
            // Clear the input
            event.target.value = '';
        }
    };

    return (
        <Box sx={{ textAlign: 'center', p: 3 }}>
            <input
                accept=".xml,application/xml,text/xml"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileUpload}
            />
            <label htmlFor="raised-button-file">
                <Button
                    variant="contained"
                    component="span"
                    startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    disabled={uploading}
                >
                    Upload XML Report
                </Button>
            </label>
            {uploading && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Uploading and processing report...
                </Typography>
            )}
        </Box>
    );
};

export default FileUpload;
