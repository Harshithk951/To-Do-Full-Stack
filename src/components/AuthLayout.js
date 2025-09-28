

import React from 'react';
import { Box, Paper } from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: '500px',
          width: '100%',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default AuthLayout;