const xml2js = require('xml2js');

const extractBasicDetails = (result) => {
    const response = result.INProfileResponse;
    const basicDetails = {
        name: `${response.Current_Application?.[0]?.Current_Application_Details?.[0]?.Current_Applicant_Details?.[0]?.First_Name?.[0] || ''} ${response.Current_Application?.[0]?.Current_Application_Details?.[0]?.Current_Applicant_Details?.[0]?.Last_Name?.[0] || ''}`.trim(),
        pan: response.CAIS_Account?.[0]?.CAIS_Account_DETAILS?.[0]?.CAIS_Holder_Details?.[0]?.Income_TAX_PAN?.[0] || 'N/A',
        dob: formatDate(response.CAIS_Account?.[0]?.CAIS_Account_DETAILS?.[0]?.CAIS_Holder_Details?.[0]?.Date_of_birth?.[0]),
        phone: response.Current_Application?.[0]?.Current_Application_Details?.[0]?.Current_Applicant_Details?.[0]?.MobilePhoneNumber?.[0] || 'N/A',
        creditScore: response.SCORE?.[0]?.BureauScore?.[0] || 'N/A'
    };
    return basicDetails;
};

const extractAccountSummary = (result) => {
    const caisSummary = result.INProfileResponse?.CAIS_Account?.[0]?.CAIS_Summary?.[0];
    return {
        totalAccounts: parseInt(caisSummary?.Credit_Account?.[0]?.CreditAccountTotal?.[0] || '0'),
        activeAccounts: parseInt(caisSummary?.Credit_Account?.[0]?.CreditAccountActive?.[0] || '0'),
        closedAccounts: parseInt(caisSummary?.Credit_Account?.[0]?.CreditAccountClosed?.[0] || '0'),
        defaultAccounts: parseInt(caisSummary?.Credit_Account?.[0]?.CreditAccountDefault?.[0] || '0'),
        totalBalance: {
            secured: parseInt(caisSummary?.Total_Outstanding_Balance?.[0]?.Outstanding_Balance_Secured?.[0] || '0'),
            unsecured: parseInt(caisSummary?.Total_Outstanding_Balance?.[0]?.Outstanding_Balance_UnSecured?.[0] || '0'),
            total: parseInt(caisSummary?.Total_Outstanding_Balance?.[0]?.Outstanding_Balance_All?.[0] || '0')
        }
    };
};

const extractCreditAccounts = (result) => {
    const accounts = result.INProfileResponse?.CAIS_Account?.[0]?.CAIS_Account_DETAILS || [];
    return accounts.map(account => ({
        accountNumber: account.Account_Number?.[0] || 'N/A',
        bank: account.Subscriber_Name?.[0]?.trim() || 'N/A',
        accountType: account.Account_Type?.[0] || 'N/A',
        openDate: formatDate(account.Open_Date?.[0]),
        status: account.Account_Status?.[0] || 'N/A',
        creditLimit: parseInt(account.Credit_Limit_Amount?.[0] || '0'),
        currentBalance: parseInt(account.Current_Balance?.[0] || '0'),
        amountOverdue: parseInt(account.Amount_Past_Due?.[0] || '0'),
        paymentHistory: account.Payment_History_Profile?.[0] || 'N/A',
        paymentHistoryDetails: extractPaymentHistory(account.CAIS_Account_History)
    }));
};

const extractPaymentHistory = (history) => {
    if (!history) return [];
    return history.map(entry => ({
        year: entry.Year?.[0],
        month: entry.Month?.[0],
        daysOverdue: parseInt(entry.Days_Past_Due?.[0] || '0')
    })).sort((a, b) => {
        // Sort by year and month in descending order
        if (a.year !== b.year) return parseInt(b.year) - parseInt(a.year);
        return parseInt(b.month) - parseInt(a.month);
    });
};

const formatDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return 'N/A';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
};

const parseXMLReport = async (xmlContent) => {
    try {
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlContent);

        return {
            basicDetails: extractBasicDetails(result),
            accountSummary: extractAccountSummary(result),
            creditAccounts: extractCreditAccounts(result)
        };
    } catch (error) {
        console.error('Error parsing XML:', error);
        throw new Error('Failed to parse credit report XML');
    }
};

module.exports = {
    parseXMLReport
};
