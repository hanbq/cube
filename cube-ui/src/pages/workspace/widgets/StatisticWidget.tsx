import { Box, Typography, useTheme } from '@mui/material';
import type { WidgetContentProps } from '../../../types/workspace';

export default function StatisticWidget({ widget }: WidgetContentProps) {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Typography 
        variant="h3" 
        color="primary" 
        sx={{ 
          fontWeight: 'bold',
          mb: 1,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {widget.data?.value || '0'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
        {widget.data?.description}
      </Typography>
    </Box>
  );
}