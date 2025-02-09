import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchAllReports } from '../store/reportSlice';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { reports, loading } = useSelector(state => state.reports);

    useEffect(() => {
        dispatch(fetchAllReports());
    }, [dispatch]);

    const handleReportClick = (id) => {
        navigate(`/report/${id}`);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Credit Report Processor
            </Typography>
            
            <FileUpload />

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Recent Reports
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
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
                                    primary={report.basicDetails.name}
                                    secondary={`Credit Score: ${report.basicDetails.creditScore} | Uploaded: ${new Date(report.uploadedAt).toLocaleDateString()}`}
                                />
                            </ListItem>
                        ))}
                        {reports.length === 0 && (
                            <ListItem>
                                <ListItemText
                                    primary="No reports found"
                                    secondary="Upload an XML report to get started"
                                />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default HomePage;
