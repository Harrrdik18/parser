const extractValue = (obj, path, defaultValue = '') => {
    try {
        const result = path.split('.').reduce((current, key) => 
            current && current[key] !== undefined ? current[key] : defaultValue, obj);
        return result;
    } catch (error) {
        console.error(`Error extracting value for path ${path}:`, error);
        return defaultValue;
    }
};

const parseNumber = (value, defaultValue = 0) => {
    if (!value || value === '?') return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
};

const extractBasicDetails = (report) => {
    const currentApplicant = report.Current_Application?.Current_Application_Details?.Current_Applicant_Details || {};
    const score = report.SCORE || {};

    // Note: In the XML, Last_Name contains the first name and First_Name contains the last name
    const details = {
        name: `${extractValue(currentApplicant, 'Last_Name')} ${extractValue(currentApplicant, 'First_Name')}`.trim(),
        mobilePhone: extractValue(currentApplicant, 'MobilePhoneNumber'),
        pan: extractValue(currentApplicant, 'IncomeTaxPan'),
        creditScore: parseInt(extractValue(score, 'BureauScore', 0))
    };
    
    return details;
};

const extractReportSummary = (report) => {
    const summary = report.CAIS_Account?.CAIS_Summary || {};
    const creditAccount = summary.Credit_Account || {};
    const totalBalance = summary.Total_Outstanding_Balance || {};

    return {
        totalAccounts: parseInt(extractValue(creditAccount, 'CreditAccountTotal', 0)),
        activeAccounts: parseInt(extractValue(creditAccount, 'CreditAccountActive', 0)),
        closedAccounts: parseInt(extractValue(creditAccount, 'CreditAccountClosed', 0)),
        currentBalanceAmount: parseNumber(extractValue(totalBalance, 'Outstanding_Balance_All', 0)),
        securedAccountsAmount: parseNumber(extractValue(totalBalance, 'Outstanding_Balance_Secured', 0)),
        unsecuredAccountsAmount: parseNumber(extractValue(totalBalance, 'Outstanding_Balance_UnSecured', 0)),
        lastSevenDaysCreditEnquiries: parseInt(extractValue(report, 'TotalCAPS_Summary.TotalCAPSLast7Days', 0))
    };
};

const extractCreditAccounts = (report) => {
    const accounts = report.CAIS_Account?.CAIS_Account_DETAILS || [];
    const accountList = Array.isArray(accounts) ? accounts : [accounts].filter(Boolean);
    
    return accountList.map(account => ({
        bank: extractValue(account, 'Subscriber_Name', '').trim(),
        accountNumber: extractValue(account, 'Account_Number'),
        accountType: extractValue(account, 'Account_Type'),
        portfolioType: extractValue(account, 'Portfolio_Type'),
        openDate: extractValue(account, 'Open_Date'),
        amountOverdue: parseNumber(extractValue(account, 'Amount_Past_Due')),
        currentBalance: parseNumber(extractValue(account, 'Current_Balance')),
        creditLimit: parseNumber(extractValue(account, 'Credit_Limit_Amount')),
        status: extractValue(account, 'Account_Status'),
        paymentHistory: extractValue(account, 'Payment_History_Profile'),
        accountHolder: {
            // Note: Names are reversed in the XML structure
            name: `${extractValue(account, 'CAIS_Holder_Details.Surname_Non_Normalized')} ${extractValue(account, 'CAIS_Holder_Details.First_Name_Non_Normalized')}`.trim(),
            pan: extractValue(account, 'CAIS_Holder_Details.Income_TAX_PAN'),
            dob: extractValue(account, 'CAIS_Holder_Details.Date_of_birth')
        }
    }));
};

const extractAddresses = (report) => {
    const accounts = report.CAIS_Account?.CAIS_Account_DETAILS || [];
    const accountList = Array.isArray(accounts) ? accounts : [accounts].filter(Boolean);
    
    const addresses = new Set();
    accountList.forEach(account => {
        const addressDetails = account.CAIS_Holder_Address_Details || {};
        const address = [
            extractValue(addressDetails, 'First_Line_Of_Address_non_normalized'),
            extractValue(addressDetails, 'Second_Line_Of_Address_non_normalized'),
            extractValue(addressDetails, 'Third_Line_Of_Address_non_normalized'),
            extractValue(addressDetails, 'City_non_normalized'),
            extractValue(addressDetails, 'State_non_normalized'),
            extractValue(addressDetails, 'ZIP_Postal_Code_non_normalized')
        ].filter(Boolean).join(', ');
        if (address) addresses.add(address);
    });
    
    return Array.from(addresses);
};

const validateParsedData = (data) => {
    const requiredFields = {
        basicDetails: ['name', 'mobilePhone', 'pan', 'creditScore'],
        reportSummary: ['totalAccounts', 'activeAccounts', 'closedAccounts', 'currentBalanceAmount'],
        creditAccounts: ['accounts']
    };

    for (const [section, fields] of Object.entries(requiredFields)) {
        if (!data[section]) {
            throw new Error(`Missing required section: ${section}`);
        }
        
        for (const field of fields) {
            if (data[section][field] === undefined) {
                throw new Error(`Missing required field: ${section}.${field}`);
            }
        }
    }
};

exports.parseXMLData = async (xmlResult) => {
    try {
        const report = xmlResult.INProfileResponse || xmlResult;
        
        if (!report) {
            throw new Error('Invalid XML structure: No credit report data found');
        }

        const parsedData = {
            basicDetails: extractBasicDetails(report),
            reportSummary: extractReportSummary(report),
            creditAccounts: {
                accounts: extractCreditAccounts(report)
            },
            addresses: extractAddresses(report)
        };

        validateParsedData(parsedData);
        return parsedData;
    } catch (error) {
        console.error('Error parsing XML data:', error);
        throw new Error(`Failed to parse XML data: ${error.message}`);
    }
};
