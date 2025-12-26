import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default class User extends React.Component {
  render() {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          用户管理
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            用户管理功能正在开发中...
          </Typography>
        </Paper>
      </Box>
    );
  }
}
