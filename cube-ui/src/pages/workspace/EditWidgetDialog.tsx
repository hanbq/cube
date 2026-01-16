import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Widget as WidgetType } from './WorkspaceTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  widget: WidgetType | null;
  onUpdate: (widget: WidgetType) => void;
}

export default function EditWidgetDialog({ open, onClose, widget, onUpdate }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (widget) {
      setTitle(widget.title);
      if (widget.type === 'statistic' && widget.data) {
        setValue(widget.data.value || '');
        setDescription(widget.data.description || '');
      }
      if (widget.type === 'text' && widget.data) {
        setText(widget.data.text || '');
      }
    }
    setError('');
  }, [widget]);

  const handleUpdate = async () => {
    if (!widget) return;
    if (!title.trim()) { setError(t('editWidgetDialog.errors.titleRequired')); return; }
    if (widget.type === 'statistic' && !value.trim()) { setError(t('editWidgetDialog.errors.valueRequired')); return; }
    if (widget.type === 'text' && !text.trim()) { setError(t('editWidgetDialog.errors.textRequired')); return; }

    setSubmitting(true); setError('');
    try {
      const updatedWidget: WidgetType = {
        ...widget,
        title,
        data: widget.type === 'statistic' ? { value, description } : widget.type === 'text' ? { text } : widget.data,
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        fontSize: '1.2rem',
        fontWeight: 600,
        py: 2
      }}>
        {t('editWidgetDialog.title')}
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
          {widget.type === 'statistic' && (
            <div style={{ display: 'flex', gap: 16 }}>
              <TextField 
                fullWidth 
                label={t('common.value')} 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                required 
                disabled={submitting}
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
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                disabled={submitting}
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
            </div>
          )}
          {widget.type === 'text' && (
            <TextField 
              fullWidth 
              label={t('widget.textContent')} 
              multiline 
              rows={4} 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              required 
              disabled={submitting}
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
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
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
          sx={{ borderRadius: 2, px: 3 }}
        >
          {submitting ? t('common.updating') : t('common.update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}