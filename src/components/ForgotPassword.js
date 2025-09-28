import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Link as MuiLink } from '@mui/material';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }
      
      toast.success(data.message);

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    
    <Paper
      elevation={5}
      sx={{
        p: 4,
        width: '100%',
        maxWidth: '400px',
        borderRadius: '12px',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Forgot Password
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        No problem! Enter your email below.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          required
          id="email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            py: 1.5,
            mb: 2,
            backgroundColor: '#d32f2f',
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
          }}
        >
          Send Reset Link
        </Button>
        <MuiLink
          component={Link}
          to="/login"
          variant="body2"
          sx={{
            color: 'text.secondary',
            textDecorationColor: 'rgba(0, 0, 0, 0.42)',
          }}
        >
          Back to Login
        </MuiLink>
      </Box>
    </Paper>
  );
}

export default ForgotPassword;