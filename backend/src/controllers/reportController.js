const xml2js = require('xml2js');
const Report = require('../models/Report');
const { parseXMLData } = require('../services/xmlParser');

exports.processXMLReport = async (req, res, next) => {
    try {
        // Check if file exists
        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ error: 'No XML file uploaded' });
        }

        console.log('File received:', {
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Convert buffer to string
        const xmlData = req.file.buffer.toString('utf8');
        
        // Log first few characters of XML data for debugging
        console.log('XML Data preview:', xmlData.substring(0, 200));

        // Configure XML parser
        const parser = new xml2js.Parser({ 
            explicitArray: false,
            trim: true,
            explicitRoot: false
        });
        
        // Parse XML
        let result;
        try {
            result = await parser.parseStringPromise(xmlData);
            console.log('XML parsed successfully. Structure:', JSON.stringify(result, null, 2).substring(0, 200));
        } catch (parseError) {
            console.error('XML parsing error:', parseError);
            return res.status(400).json({ 
                error: 'Invalid XML format',
                details: parseError.message 
            });
        }

        // Process parsed data
        let processedData;
        try {
            processedData = await parseXMLData(result);
            console.log('Data processed successfully');
        } catch (processError) {
            console.error('Data processing error:', processError);
            return res.status(400).json({ 
                error: 'Error processing XML data',
                details: processError.message 
            });
        }

        // Save to database
        try {
            const report = new Report(processedData);
            await report.save();
            console.log('Report saved successfully with ID:', report._id);

            res.status(201).json({
                message: 'Report processed successfully',
                reportId: report._id
            });
        } catch (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({ 
                error: 'Error saving report to database',
                details: dbError.message 
            });
        }
    } catch (error) {
        console.error('Unexpected error in processXMLReport:', error);
        next(error);
    }
};

exports.getReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(report);
    } catch (error) {
        console.error('Error in getReport:', error);
        next(error);
    }
};

exports.getAllReports = async (req, res, next) => {
    try {
        const reports = await Report.find().sort({ uploadedAt: -1 });
        res.json(reports);
    } catch (error) {
        console.error('Error in getAllReports:', error);
        next(error);
    }
};
