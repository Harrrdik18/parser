const xml2js = require('xml2js');
const Report = require('../models/Report');
const { parseXMLReport } = require('../services/xmlParser');

const processXMLReport = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No XML file uploaded' });
        }

        // Convert buffer to string
        const xmlContent = req.file.buffer.toString('utf-8');
        
        // Parse the XML content
        const parsedData = await parseXMLReport(xmlContent);

        // Create a new report document
        const report = new Report({
            basicDetails: parsedData.basicDetails,
            accountSummary: parsedData.accountSummary,
            creditAccounts: parsedData.creditAccounts,
            uploadedAt: new Date()
        });

        // Save the report
        const savedReport = await report.save();
        res.status(201).json(savedReport);
    } catch (error) {
        console.error('Error processing XML report:', error);
        next(error);
    }
};

const getReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        next(error);
    }
};

const getAllReports = async (req, res, next) => {
    try {
        const reports = await Report.find()
            .select('basicDetails uploadedAt')
            .sort({ uploadedAt: -1 });
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        next(error);
    }
};

module.exports = {
    processXMLReport,
    getReport,
    getAllReports
};
