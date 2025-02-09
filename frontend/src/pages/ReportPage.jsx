import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReportDetails from '../components/ReportDetails';
import { useReport } from '../context/ReportContext';

const ReportPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentReport, loading, error, getReport, clearCurrentReport } = useReport();

    useEffect(() => {
        let mounted = true;

        const loadReport = async () => {
            try {
                if (id && mounted) {
                    await getReport(id);
                }
            } catch (err) {
                if (mounted) {
                    console.error('Error loading report:', err);
                }
            }
        };

        loadReport();

        return () => {
            mounted = false;
            clearCurrentReport();
        };
    }, [id, getReport, clearCurrentReport]);

    const handleBack = () => {
        navigate('/');
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Box sx={{ mt: 2 }}>
                    <Typography color="error" variant="body1">
                        {error}
                    </Typography>
                </Box>
            );
        }

        if (!currentReport) {
            return (
                <Box sx={{ mt: 2 }}>
                    <Typography color="text.secondary" variant="body1">
                        Report not found
                    </Typography>
                </Box>
            );
        }

        return <ReportDetails report={currentReport} />;
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ mb: 2 }}
            >
                Back to Home
            </Button>
            {currentReport && (
                <Typography variant="h4" gutterBottom>
                    Credit Report for {currentReport.basicDetails.name}
                </Typography>
            )}
            {renderContent()}
        </Box>
    );
};

export default ReportPage;
