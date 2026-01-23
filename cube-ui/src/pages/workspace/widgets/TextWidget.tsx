import { Box, Typography, useTheme, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { WidgetContentProps } from '../../../types/workspace';

export default function TextWidget({ widget }: WidgetContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ 
      p: 2,
      bgcolor: alpha(theme.palette.background.paper, 0.5),
      borderRadius: 2,
      minHeight: 100
    }}>
      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
        {widget.data?.text || t('widget.textContent')}
      </Typography>
    </Box>
  );
}