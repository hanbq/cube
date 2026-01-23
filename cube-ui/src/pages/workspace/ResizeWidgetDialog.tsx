import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, alpha, Typography, Box, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Widget as WidgetType } from '../../types/workspace';

interface Props {
  open: boolean;
  onClose: () => void;
  widget: WidgetType | null;
  onResize: (widget: WidgetType, size: 'small' | 'medium' | 'large') => void;
}

export default function ResizeWidgetDialog({ open, onClose, widget, onResize }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    if (widget) {
      setSize(widget.size || 'medium');
    }
  }, [widget]);

  const handleResize = () => {
    if (!widget) return;
    onResize(widget, size);
    onClose();
  };

  if (!widget) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 3,
          boxShadow: (theme) => theme.shadows[8],
        } 
      }}
    >
      <DialogTitle sx={{ 
        pb: 1, 
        pt: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
      }}>
        <Typography variant="h5" component="div" fontWeight={600}>
          {t('resizeWidgetDialog.title', { widgetTitle: widget.title })}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: size === 'small' 
                ? `2px solid ${theme.palette.primary.main}` 
                : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              borderRadius: 2,
              transition: 'all 0.2s ease',
              overflow: 'hidden',
              flex: 1,
              maxWidth: 150,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.shadows[4],
              },
              ...(size === 'small' && {
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              })
            }}
            onClick={() => setSize('small')}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Box sx={{ 
                height: 50, 
                width: 50, 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                mx: 'auto',
                mb: 2,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} />
              <Typography variant="subtitle1" fontWeight={600}>{t('common.small')}</Typography>
              <Typography variant="caption" color="text.secondary">{t('addWidgetDialog.sizes.small.description')}</Typography>
            </CardContent>
          </Card>
          
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: size === 'medium' 
                ? `2px solid ${theme.palette.primary.main}` 
                : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              borderRadius: 2,
              transition: 'all 0.2s ease',
              overflow: 'hidden',
              flex: 1,
              maxWidth: 200,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.shadows[4],
              },
              ...(size === 'medium' && {
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              })
            }}
            onClick={() => setSize('medium')}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Box sx={{ 
                height: 50, 
                width: 100, 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                mx: 'auto', 
                mb: 2,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} />
              <Typography variant="subtitle1" fontWeight={600}>{t('common.medium')}</Typography>
              <Typography variant="caption" color="text.secondary">{t('addWidgetDialog.sizes.medium.description')}</Typography>
            </CardContent>
          </Card>
          
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: size === 'large' 
                ? `2px solid ${theme.palette.primary.main}` 
                : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              borderRadius: 2,
              transition: 'all 0.2s ease',
              overflow: 'hidden',
              flex: 1,
              maxWidth: 250,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.shadows[4],
              },
              ...(size === 'large' && {
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              })
            }}
            onClick={() => setSize('large')}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Box sx={{ 
                height: 50, 
                width: 150, 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                mx: 'auto', 
                mb: 2,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} />
              <Typography variant="subtitle1" fontWeight={600}>{t('common.large')}</Typography>
              <Typography variant="caption" color="text.secondary">{t('addWidgetDialog.sizes.large.description')}</Typography>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button 
          onClick={onClose} 
          size="medium"
          sx={{ borderRadius: 2, px: 3 }}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleResize} 
          variant="contained" 
          size="medium"
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: (theme) => theme.shadows[3],
          }}
        >
          {t('common.resize')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}