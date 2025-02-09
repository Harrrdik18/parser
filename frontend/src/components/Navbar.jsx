import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    CreditSea Report Processor
                </Typography>
                <Button
                    color="inherit"
                    component={RouterLink}
                    to="/"
                    startIcon={<HomeIcon />}
                >
                    Home
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
