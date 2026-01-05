import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

export default class Dashboard extends React.Component {
  render() {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          仪表盘
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                总用户数
              </Typography>
              <Typography variant="h3" color="primary">
                1,234
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                工作流数
              </Typography>
              <Typography variant="h3" color="primary">
                56
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                活跃任务
              </Typography>
              <Typography variant="h3" color="primary">
                89
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                完成率
              </Typography>
              <Typography variant="h3" color="primary">
                92%
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
