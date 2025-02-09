import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';

const ReportDetails = ({ report }) => {
    if (!report) return null;

    const { basicDetails, reportSummary, creditAccounts } = report;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Basic Details</Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="Name" secondary={basicDetails.name} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Mobile" secondary={basicDetails.mobilePhone} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="PAN" secondary={basicDetails.pan} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Credit Score" secondary={basicDetails.creditScore} />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Report Summary</Typography>
                        <List>
                            <ListItem>
                                <ListItemText 
                                    primary="Total Accounts" 
                                    secondary={reportSummary.totalAccounts} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Active Accounts" 
                                    secondary={reportSummary.activeAccounts} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Current Balance" 
                                    secondary={`₹${reportSummary.currentBalanceAmount.toLocaleString()}`} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Recent Enquiries" 
                                    secondary={reportSummary.lastSevenDaysCreditEnquiries} 
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Credit Cards</Typography>
                        {creditAccounts.creditCards.map((card, index) => (
                            <React.Fragment key={index}>
                                <List>
                                    <ListItem>
                                        <ListItemText 
                                            primary={card.bank}
                                            secondary={`Account: ${card.accountNumber}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Current Balance"
                                            secondary={`₹${card.currentBalance.toLocaleString()}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Amount Overdue"
                                            secondary={`₹${card.amountOverdue.toLocaleString()}`}
                                        />
                                    </ListItem>
                                </List>
                                {index < creditAccounts.creditCards.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ReportDetails;
