import React, { useState, useEffect } from 'react';
import {
    Modal, Box, Typography, TextField, Button, Grid, Avatar, IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 }, // Responsive width
    bgcolor: 'background.paper',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};

function ProfileModal({ open, onClose, user, onSave }) {
    // FIX 1: Initialize state with the desired default values.
    const [userData, setUserData] = useState({
        avatar: '',
        name: 'Harshith Kumar.M',
        email: 'mharshithkumar951@gmail.com',
        role: 'Full Stack Developer',
        location: 'Dehradun, India',
    });

    // This effect ensures that when the real user data loads,
    // it overrides the defaults, while keeping the defaults as a fallback.
    useEffect(() => {
        if (user) {
            setUserData({
                avatar: user.avatar || '',
                name: user.name || 'Harshith Kumar.M',
                email: user.email || 'mharshithkumar951@gmail.com',
                role: user.role || 'Full Stack Developer',
                location: user.location || 'Dehradun, India',
            });
        }
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onSave(userData);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    {/* FIX 2: Bolder title to match screenshot */}
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        Edit Profile
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                {/* FIX 3: Updated Grid layout to match screenshot */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar src={userData.avatar} sx={{ width: 80, height: 80 }} />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            fullWidth
                            label="Avatar URL"
                            name="avatar"
                            value={userData.avatar}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Role"
                            name="role"
                            value={userData.role}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            value={userData.location}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
                
                {/* FIX 4: Correct button styling and placement */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="text" onClick={onClose} sx={{ color: 'grey.600' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            backgroundColor: '#d32f2f',
                            '&:hover': { backgroundColor: '#b71c1c' },
                        }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ProfileModal;