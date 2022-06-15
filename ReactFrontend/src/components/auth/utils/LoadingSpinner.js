import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoadingSpinner() {
  return (
      <div className='coverSpinner'>
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
    </div>
  );
}