import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { WidgetEditProps } from '../../../types/workspace';

export default function ChartWidgetEdit(_props: WidgetEditProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {t('widget.chartEditPlaceholder')}
      </Typography>
    </Box>
  );
}