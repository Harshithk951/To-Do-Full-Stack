import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      toast.success(data.message + " Redirecting to login...");
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
      }}
    >
      <Paper component="div" elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: '400px', width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Reset Your Password</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1 }}>Please enter a new strong password.</Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>New Password</Typography>
          <TextField
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.gantt.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Confirm New Password</Typography>
          <TextField
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ResetPassword;