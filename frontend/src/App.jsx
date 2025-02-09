import React from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReportProvider } from './context/ReportContext';
import theme from './theme';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <ReportProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/report/:id" element={<ReportPage />} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </ReportProvider>
  );
}

export default App;
