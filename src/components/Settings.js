import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, TextField, Button,
    Switch, FormControlLabel, Select, MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';
import { useThemeContext } from '../theme/ThemeContext';

function Settings() {
    const { themeMode, setThemeMode } = useThemeContext();

    const [accountInfo, setAccountInfo] = useState({
        fullName: 'Harshith Kumar.M',
        role: 'Full Stack Developer',
        location: 'Dehradun, India',
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [notifications, setNotifications] = useState({
        emailOnNewTask: true,
        emailOnDeadline: true,
        pushOnMention: false,
    });

    const handleAccountChange = (event) => {
        const { name, value } = event.target;
        setAccountInfo(prevState => ({ ...prevState, [name]: value }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswords(prevState => ({ ...prevState, [name]: value }));
    };

    const handleThemeChange = (event) => {
        setThemeMode(event.target.value);
        toast.success(`Theme changed to ${event.target.value}`);
    };

    const handleNotificationChange = (event) => {
        setNotifications({ ...notifications, [event.target.name]: event.target.checked });
    };

    const handleSaveChanges = () => {
        console.log('Saving account information:', accountInfo);
        toast.success('Account information saved successfully!');
    };

    const handleUpdatePassword = () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        if (!passwords.newPassword || !passwords.currentPassword) {
            toast.error("Please fill in all password fields.");
            return;
        }
        console.log('Updating password.');
        toast.success('Password updated successfully!');
        setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Settings
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card elevation={0}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Account Information</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Update your personal details and account information.
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" name="fullName" value={accountInfo.fullName} onChange={handleAccountChange} variant="outlined" /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="Email Address" defaultValue="mharshithkumar6@gmail.com" variant="outlined" InputProps={{ readOnly: true }} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="Role" name="role" value={accountInfo.role} onChange={handleAccountChange} variant="outlined" /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="Location" name="location" value={accountInfo.location} onChange={handleAccountChange} variant="outlined" /></Grid>
                            </Grid>
                            <Button variant="contained" onClick={handleSaveChanges} sx={{ mt: 3, textTransform: 'none', px: 4 }}>Save Changes</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Application Preferences</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Customize the look and feel of your workspace.
                            </Typography>
                            <Box>
                                <Typography gutterBottom variant="subtitle2" color="text.secondary">Theme</Typography>
                                <Select value={themeMode} onChange={handleThemeChange} fullWidth>
                                    <MenuItem value="light">Light</MenuItem>
                                    <MenuItem value="dark">Dark</MenuItem>
                                </Select>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Notification Settings</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Manage how you receive alerts and updates.
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <FormControlLabel control={<Switch checked={notifications.emailOnNewTask} onChange={handleNotificationChange} name="emailOnNewTask" />} label="Email on new task" />
                                <FormControlLabel control={<Switch checked={notifications.emailOnDeadline} onChange={handleNotificationChange} name="emailOnDeadline" />} label="Email on deadline reminder" />
                                <FormControlLabel control={<Switch checked={notifications.pushOnMention} onChange={handleNotificationChange} name="pushOnMention" />} label="Push notification on mention" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card elevation={0}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Security</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Keep your account secure by updating your password.
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}><TextField type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} fullWidth label="Current Password" variant="outlined" /></Grid>
                                <Grid item xs={12} sm={4}><TextField type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} fullWidth label="New Password" variant="outlined" /></Grid>
                                <Grid item xs={12} sm={4}><TextField type="password" name="confirmNewPassword" value={passwords.confirmNewPassword} onChange={handlePasswordChange} fullWidth label="Confirm New Password" variant="outlined" /></Grid>
                            </Grid>
                            <Button variant="contained" onClick={handleUpdatePassword} sx={{ mt: 3, textTransform: 'none', px: 4 }}>Update Password</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Settings;