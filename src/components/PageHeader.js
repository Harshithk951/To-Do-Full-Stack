import React from 'react';
import { Box, Typography } from '@mui/material';

function PageHeader({ title, subtitle }) {
  return (
    <Box sx={{ padding: 4, borderBottom: '1px solid #e0e0e0', mb: 2 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

export default PageHeader;