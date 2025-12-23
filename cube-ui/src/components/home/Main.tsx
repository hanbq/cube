import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default class Main extends React.Component {
  render() {
    return (
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3,
          backgroundColor: 'background.default',
          height: '100%',
        }}
      >
        <Outlet />
      </Box>
    );
  }
}
