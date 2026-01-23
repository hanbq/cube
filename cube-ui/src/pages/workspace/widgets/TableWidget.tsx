import { Box, Typography, useTheme, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { WidgetContentProps } from '../../../types/workspace';

export default function TableWidget(_props: WidgetContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ 
      p: 2,
      bgcolor: alpha(theme.palette.background.paper, 0.5),
      borderRadius: 2,
      border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`
    }}>
      <Typography variant="body2" color="text.secondary">
        {t('widget.tablePlaceholder')}
      </Typography>
    </Box>
  );
}