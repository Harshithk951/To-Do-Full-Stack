import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, AccountCircleOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';

const illustrationPath = '/login-illustration.png';

const Login = () => {
  
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('demopassword');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(\${process.env.REACT_APP_API_URL}/login`, {`
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to login');
      
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'An error occurred during login.');
    }
  };

  return (
    // The rest of your JSX is perfectly fine.
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
        p: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          maxWidth: '1000px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Box
            component="img"
            src={illustrationPath}
            alt="Sign In Illustration"
            sx={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, sm: 5 },
          }}
        >
          <Box sx={{ maxWidth: '400px', width: '100%' }}>
            <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
              Sign In
            </Typography>
            <Box component="form" noValidate onSubmit={handleLogin}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircleOutlined /></InputAdornment>)}}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><LockOutlined /></InputAdornment>),
                  endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: '#d32f2f', '&.Mui-checked': { color: '#d32f2f' } }} />} label="Remember Me" />
                <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ fontWeight: 'bold', color: '#d32f2f', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </Box>
              <Button type="submit" fullWidth variant="contained" sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold', backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' } }}>
                LOGIN
              </Button>
              <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 3 }}>
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" variant="body2" sx={{ fontWeight: 'bold', color: '#d32f2f', textDecoration: 'none' }}>
                  Create One
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
