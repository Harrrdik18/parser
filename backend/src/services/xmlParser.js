const xml2js = require('xml2js');

const parseXMLReport = async (xmlContent) => {
    try {
        const parser = new xml2js.Parser({ explicitArray: true });
        const result = await parser.parseStringPromise(xmlContent);

        return {
            basicDetails: extractBasicDetails(result),
            accountSummary: extractAccountSummary(result),
            creditAccounts: extractCreditAccounts(result)
        };
    } catch (error) {
        throw new Error(`Failed to parse XML: ${error.message}`);
    }
};

const extractBasicDetails = (result) => {
    const response = result.INProfileResponse;
    const basicDetails = {
        name: `${response.Current_Application?.[0]?.Current_Application_Details?.[0]?.Current_Applicant_Details?.[0]?.First_Name?.[0] || ''} ${response.Current_Application?.[0]?.Current_Application_Details?.[0]?.Current_Applicant_Details?.[0]?.Last_Name?.[0] || ''}`.trim(),
        pan: response.Current_Application?.[0]?.Current_Application_Details?.[0]?.Current_Applicant_Details?.[0]?.PAN?.[0] || '',
        dob: response.Current_Application?.[0]?.Current_Application_Details?.[0]?.Current_Applicant_Details?.[0]?.Date_Of_Birth?.[0] || '',
        phone: response.Current_Application?.[0]?.Current_Application_Details?.[0]?.Current_Applicant_Details?.[0]?.Mobile_Phone?.[0] || '',
        creditScore: response.Credit_Score?.[0]?.Score?.[0] || ''
    };
    return basicDetails;
};

const extractAccountSummary = (result) => {
    const response = result.INProfileResponse;
    const summary = response.Account_Summary?.[0] || {};

    return {
        totalAccounts: parseInt(summary.Total_Accounts?.[0] || '0', 10),
        activeAccounts: parseInt(summary.Active_Accounts?.[0] || '0', 10),
        closedAccounts: parseInt(summary.Closed_Accounts?.[0] || '0', 10),
        defaultAccounts: parseInt(summary.Default_Accounts?.[0] || '0', 10),
        totalBalance: {
            secured: parseInt(summary.Secured_Balance?.[0] || '0', 10),
            unsecured: parseInt(summary.Unsecured_Balance?.[0] || '0', 10),
            total: parseInt(summary.Total_Balance?.[0] || '0', 10)
        }
    };
};

const extractCreditAccounts = (result) => {
    const response = result.INProfileResponse;
    const accounts = response.Credit_Accounts?.[0]?.Account || [];

    return accounts.map(account => ({
        accountNumber: account.Account_Number?.[0] || '',
        bank: account.Bank_Name?.[0] || '',
        accountType: account.Account_Type?.[0] || '',
        openDate: account.Open_Date?.[0] || '',
        status: account.Account_Status?.[0] || '',
        creditLimit: parseInt(account.Credit_Limit?.[0] || '0', 10),
        currentBalance: parseInt(account.Current_Balance?.[0] || '0', 10),
        amountOverdue: parseInt(account.Amount_Overdue?.[0] || '0', 10),
        paymentHistory: account.Payment_History?.[0] || '',
        paymentHistoryDetails: extractPaymentHistory(account.Payment_History_Details?.[0])
    }));
};

const extractPaymentHistory = (historyDetails) => {
    if (!historyDetails || !historyDetails.History) return [];

    return historyDetails.History.map(history => ({
        year: history.Year?.[0] || '',
        month: history.Month?.[0] || '',
        daysOverdue: parseInt(history.Days_Overdue?.[0] || '0', 10)
    }));
};

module.exports = {
    parseXMLReport
};
