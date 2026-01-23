import { TextField, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { WidgetEditProps } from '../../../types/workspace';

export default function StatisticWidgetEdit({ data, onChange, disabled }: WidgetEditProps) {
  const { t } = useTranslation();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, value: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, description: e.target.value });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        label={t('common.value')}
        value={data.value || ''}
        onChange={handleValueChange}
        disabled={disabled}
        variant="outlined"
        InputProps={{
          sx: {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: 'primary.main',
            }
          }
        }}
      />
      <TextField
        fullWidth
        label={t('common.description')}
        value={data.description || ''}
        onChange={handleDescriptionChange}
        disabled={disabled}
        variant="outlined"
        InputProps={{
          sx: {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: 'primary.main',
            }
          }
        }}
      />
    </Box>
  );
}