const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
    bank: String,
    accountNumber: String,
    amountOverdue: Number,
    currentBalance: Number
});

const reportSchema = new mongoose.Schema({
    basicDetails: {
        name: String,
        mobilePhone: String,
        pan: String,
        creditScore: Number
    },
    reportSummary: {
        totalAccounts: Number,
        activeAccounts: Number,
        closedAccounts: Number,
        currentBalanceAmount: Number,
        securedAccountsAmount: Number,
        unsecuredAccountsAmount: Number,
        lastSevenDaysCreditEnquiries: Number
    },
    creditAccounts: {
        creditCards: [creditCardSchema],
        addresses: [String]
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);
