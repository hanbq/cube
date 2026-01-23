import { Box, Typography, useTheme, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { WidgetContentProps } from '../../../types/workspace';

export default function ChartWidget(_props: WidgetContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ 
      height: 200, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: alpha(theme.palette.primary.main, 0.05),
      borderRadius: 2,
      border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`
    }}>
      <Typography variant="body2" color="text.secondary">
        {t('widget.chartPlaceholder')}
      </Typography>
    </Box>
  );
}