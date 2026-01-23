import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Alert, useTheme, alpha, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Widget as WidgetType } from '../../types/workspace';
import { getWidgetEditComponent } from './widgets';

interface Props {
  open: boolean;
  onClose: () => void;
  widget: WidgetType | null;
  onUpdate: (widget: WidgetType) => void;
}

export default function EditWidgetDialog({ open, onClose, widget, onUpdate }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [widgetData, setWidgetData] = useState<any>({});

  useEffect(() => {
    if (widget) {
      setTitle(widget.title);
      setWidgetData(widget.data || {});
    }
    setError('');
  }, [widget]);

  const handleUpdate = async () => {
    if (!widget) return;
    if (!title.trim()) { setError(t('editWidgetDialog.errors.titleRequired')); return; }

    setSubmitting(true); setError('');
    try {
      const updatedWidget: WidgetType = {
        ...widget,
        title,
        data: widgetData,
      };
      onUpdate(updatedWidget);
      onClose();
    } catch (err) {
      setError(t('editWidgetDialog.errors.updateFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!widget) return null;

  // 获取对应类型的小部件编辑组件
  const WidgetEditComponent = getWidgetEditComponent(widget.type);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle sx={{ 
        pb: 1, 
        pt: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
      }}>
        <Typography variant="h5" component="div" fontWeight={600}>
          {t('editWidgetDialog.title')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': { fontWeight: 500 }
            }}
          >
            {error}
          </Alert>
        )}
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField 
            fullWidth 
            label={t('common.title')} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            disabled={submitting}
            variant="outlined"
          />
          {WidgetEditComponent && (
            <WidgetEditComponent
              data={widgetData}
              onChange={setWidgetData}
              disabled={submitting}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button 
          onClick={onClose} 
          disabled={submitting} 
          size="medium"
          sx={{ borderRadius: 2, px: 3 }}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleUpdate} 
          variant="contained" 
          disabled={submitting} 
          size="medium"
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: (theme) => theme.shadows[3],
          }}
        >
          {submitting ? t('common.updating') : t('common.update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}