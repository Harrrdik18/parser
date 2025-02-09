import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Typography, 
    Box, 
    Button, 
    CircularProgress 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReportDetails from '../components/ReportDetails';
import { fetchReport } from '../store/reportSlice';

const ReportPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentReport, loading, error } = useSelector(state => state.reports);

    useEffect(() => {
        if (id) {
            dispatch(fetchReport(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mb: 2 }}
                >
                    Back to Home
                </Button>
                <Typography color="error">
                    Error loading report: {error}
                </Typography>
            </Box>
        );
    }

    if (!currentReport) {
        return (
            <Box>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mb: 2 }}
                >
                    Back to Home
                </Button>
                <Typography>Report not found</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 2 }}
            >
                Back to Home
            </Button>
            
            <Typography variant="h4" gutterBottom>
                Credit Report for {currentReport.basicDetails.name}
            </Typography>
            
            <ReportDetails report={currentReport} />
        </Box>
    );
};

export default ReportPage;
