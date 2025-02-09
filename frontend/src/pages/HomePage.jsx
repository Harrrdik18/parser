import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Typography, 
    Box, 
    List, 
    ListItem, 
    ListItemText, 
    Paper,
    CircularProgress
} from '@mui/material';
import FileUpload from '../components/FileUpload';
import { useReport } from '../context/ReportContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { reports, loading } = useReport();

    const handleReportClick = (id) => {
        navigate(`/report/${id}`);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Credit Report Analyzer
            </Typography>
            <FileUpload />
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Recent Reports
                    </Typography>
                    {reports && reports.length > 0 ? (
                        <Paper elevation={2}>
                            <List>
                                {reports.map((report, index) => (
                                    <ListItem
                                        key={report._id}
                                        button
                                        onClick={() => handleReportClick(report._id)}
                                        divider={index < reports.length - 1}
                                    >
                                        <ListItemText
                                            primary={report.basicDetails?.name || 'Unnamed Report'}
                                            secondary={`Credit Score: ${report.basicDetails?.creditScore || 'N/A'} | Uploaded: ${new Date(report.uploadedAt).toLocaleDateString()}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    ) : (
                        <Typography color="text.secondary">
                            No reports available. Upload a credit report to get started.
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default HomePage;
