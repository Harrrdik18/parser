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

    const { basicDetails, accountSummary, creditAccounts } = report;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Basic Details</Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="Name" secondary={basicDetails.name || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Phone" secondary={basicDetails.phone || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="PAN" secondary={basicDetails.pan || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Date of Birth" secondary={basicDetails.dob || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Credit Score" secondary={basicDetails.creditScore || 'N/A'} />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Account Summary</Typography>
                        <List>
                            <ListItem>
                                <ListItemText 
                                    primary="Total Accounts" 
                                    secondary={accountSummary?.totalAccounts || 0} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Active Accounts" 
                                    secondary={accountSummary?.activeAccounts || 0} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Closed Accounts" 
                                    secondary={accountSummary?.closedAccounts || 0} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Default Accounts" 
                                    secondary={accountSummary?.defaultAccounts || 0} 
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText 
                                    primary="Total Balance" 
                                    secondary={`₹${accountSummary?.totalBalance?.total?.toLocaleString() || 0}`} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Secured Balance" 
                                    secondary={`₹${accountSummary?.totalBalance?.secured?.toLocaleString() || 0}`} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Unsecured Balance" 
                                    secondary={`₹${accountSummary?.totalBalance?.unsecured?.toLocaleString() || 0}`} 
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Credit Accounts</Typography>
                        <Grid container spacing={2}>
                            {creditAccounts?.map((account, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {account.bank} - {account.accountType}
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Account Number"
                                                        secondary={account.accountNumber || 'N/A'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Status"
                                                        secondary={account.status || 'N/A'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Open Date"
                                                        secondary={account.openDate || 'N/A'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Credit Limit"
                                                        secondary={account.creditLimit ? `₹${account.creditLimit.toLocaleString()}` : 'N/A'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Current Balance"
                                                        secondary={account.currentBalance ? `₹${account.currentBalance.toLocaleString()}` : 'N/A'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Amount Overdue"
                                                        secondary={account.amountOverdue ? `₹${account.amountOverdue.toLocaleString()}` : 'N/A'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Payment History"
                                                        secondary={account.paymentHistory || 'N/A'}
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ReportDetails;
