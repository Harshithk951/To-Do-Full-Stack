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
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, AccountCircleOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';

const illustrationPath = '/login-illustration.png';

const Login = () => {
  const [email, setEmail] = useState('admin@demo.com'); 
  const [password, setPassword] = useState('demopassword'); 
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoAlert, setShowDemoAlert] = useState(true);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('🔐 Attempting login with:', { email, apiUrl: API_URL });
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Login successful:', data);
      
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('👤 User data stored:', data.user);
      }
      
      toast.success(`Welcome back, ${data.user?.name || 'User'}!`);
      
      navigate('/');
    } catch (err) {
      console.error('❌ Login error:', err);
      
      let errorMessage;
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        if (API_URL.includes('localhost')) {
          errorMessage = 'Unable to connect to local server. Please ensure the backend is running on port 3001.';
        } else {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        }
      } else if (err.message.includes('Invalid credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else {
        errorMessage = err.message || 'An error occurred during login.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@demo.com');
    setPassword('demopassword');
    setShowDemoAlert(false);
  };

  const checkServerHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      toast.info(`Server Status: ${data.status}, Database: ${data.database}`);
    } catch (error) {
      if (API_URL.includes('localhost')) {
        toast.error('Local server is not responding. Please start the backend server.');
      } else {
        toast.error('Unable to reach the server. Please check your connection.');
      }
    }
  };

  const isProduction = !API_URL.includes('localhost');
  const environmentType = isProduction ? 'Production' : 'Development';

  return (
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
          display: 'flex',
          maxWidth: '1000px',
          width: '100%',
          minHeight: '600px',
          borderRadius: '16px',
          overflow: 'hidden',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, sm: 5 },
            backgroundColor: '#ffffff',
            minHeight: { xs: '400px', md: 'auto' },
          }}
        >
          <Box sx={{ maxWidth: '400px', width: '100%' }}>
            <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
              Sign In
            </Typography>
            
            <Alert 
              severity={isProduction ? "success" : "info"} 
              sx={{ mb: 2, fontSize: '0.875rem' }}
            >
              {environmentType} Environment - {isProduction ? 'Vercel + Render + Aiven' : 'Local Development'}
            </Alert>
            
            {showDemoAlert && (
              <Alert 
                severity="info" 
                sx={{ mb: 2, fontSize: '0.875rem' }}
                action={
                  <Button color="inherit" size="small" onClick={handleDemoLogin}>
                    Use Demo
                  </Button>
                }
                onClose={() => setShowDemoAlert(false)}
              >
                Demo: admin@demo.com / demopassword
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            
            <Box component="form" noValidate onSubmit={handleLogin}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleOutlined />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleClickShowPassword} 
                        onMouseDown={handleMouseDownPassword} 
                        edge="end"
                        aria-label="toggle password visibility"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)} 
                      disabled={isLoading}
                      sx={{ 
                        color: '#d32f2f', 
                        '&.Mui-checked': { color: '#d32f2f' } 
                      }} 
                    />
                  } 
                  label="Remember Me" 
                />
                <Link 
                  component={RouterLink} 
                  to="/forgot-password" 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#d32f2f', 
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                disabled={isLoading || !email || !password}
                sx={{ 
                  py: 1.5, 
                  fontSize: '1rem', 
                  fontWeight: 'bold', 
                  backgroundColor: '#d32f2f', 
                  '&:hover': { backgroundColor: '#b71c1c' },
                  '&:disabled': { backgroundColor: '#ccc' }
                }}
              >
                {isLoading ? 'SIGNING IN...' : 'LOGIN'}
              </Button>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Demo Login
                </Button>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={checkServerHealth}
                  disabled={isLoading}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Server Status
                </Button>
              </Box>
              <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 3 }}>
                {"Don't have an account?"}{' '}
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#d32f2f', 
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Create One
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            p: 4,
          }}
        >
          <Box
            component="img"
            src={illustrationPath}
            alt="Sign In Illustration"
            sx={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;