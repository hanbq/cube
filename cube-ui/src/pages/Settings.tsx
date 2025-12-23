import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default class Settings extends React.Component {
  render() {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          系统设置
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            系统设置功能正在开发中...
          </Typography>
        </Paper>
      </Box>
    );
  }
}
