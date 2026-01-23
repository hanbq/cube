import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { WidgetEditProps } from '../../../types/workspace';

export default function TextWidgetEdit({ data, onChange, disabled }: WidgetEditProps) {
  const { t } = useTranslation();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, text: e.target.value });
  };

  return (
    <TextField
      fullWidth
      label={t('widget.textContent')}
      multiline
      rows={4}
      value={data.text || ''}
      onChange={handleTextChange}
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
  );
}