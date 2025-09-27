import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  Paper,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import {
  PersonOutline,
  BadgeOutlined,
  AlternateEmailOutlined,
  EmailOutlined,
  PhoneOutlined,
  LockOutlined,
  VpnKeyOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// FIX: The import statement for the image has been removed.
// We will now reference the image directly from the `public` folder.

function Register() {
  const [formData, setFormData] = useState({
    firstName: 'Harshith',
    lastName: 'Kumar',
    username: 'harshith.kumar',
    email: 'harshith.kumar@example.com',
    phone: '+91 98765 43210',
    password: '••••••••••',
    confirmPassword: '••••••••••',
    agreeTerms: true,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#f0f4f8';
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!formData.agreeTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }
    try {
      const { firstName, lastName, username, email, phone, password } = formData;
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, username, email, phone, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }
      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          maxWidth: '960px',
          width: '100%',
          borderRadius: '16px',
          display: 'flex',
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)',
        }}
      >
        {/* Left Column: Illustration */}
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, p: 4, alignItems: 'center', justifyContent: 'center' }}>
          <Box
            component="img"
            // FIX: The 'src' now points to the image in the 'public' folder.
            src="/R.png" 
            alt="Registration Illustration"
            sx={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </Box>
        
        {/* Right Column: Form */}
        <Box sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutline /></InputAdornment>) }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><BadgeOutlined /></InputAdornment>) }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth margin="normal" name="username" label="Username"
              value={formData.username} onChange={handleChange}
              InputProps={{ startAdornment: (<InputAdornment position="start"><AlternateEmailOutlined /></InputAdornment>) }}
            />
            <TextField
              fullWidth margin="normal" name="email" type="email" label="Email Address"
              value={formData.email} onChange={handleChange}
              InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlined /></InputAdornment>) }}
            />
            <TextField
              fullWidth margin="normal" name="phone" label="Phone Number"
              value={formData.phone} onChange={handleChange}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneOutlined /></InputAdornment>) }}
            />
            <TextField
              fullWidth margin="normal" name="password" type={showPassword ? 'text' : 'password'}
              label="Password" value={formData.password} onChange={handleChange}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><LockOutlined /></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth margin="normal" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password" value={formData.confirmPassword} onChange={handleChange}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><VpnKeyOutlined /></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  sx={{ color: '#d32f2f', '&.Mui-checked': { color: '#d32f2f' } }}
                />
              }
              label="I agree to all terms*"
            />
            <Button
              type="submit" fullWidth variant="contained"
              sx={{
                mt: 2, mb: 2, py: 1.5,
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' },
                fontSize: '1rem', fontWeight: 'bold'
              }}
            >
              REGISTER
            </Button>
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                Sign In
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register;