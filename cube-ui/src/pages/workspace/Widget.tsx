import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Menu, MenuItem, useTheme, alpha } from '@mui/material';
import { MoreVert as MoreVertIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import type { Widget as WidgetType } from './WorkspaceTypes';

interface WidgetProps {
  widget: WidgetType;
  onEdit: (widget: WidgetType) => void;
  onDelete: (id: string) => void;
}

export default function Widget({ widget, onEdit, onDelete }: WidgetProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleEdit = () => { onEdit(widget); handleMenuClose(); };
  const handleDelete = () => { onDelete(widget.id); handleMenuClose(); };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'statistic':
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
      case 'chart':
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
      case 'table':
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
      case 'text':
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
      default:
        return null;
    }
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        p: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: (theme) => theme.shadows[1],
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
          transform: 'translateY(-2px)',
        },
        '& .widget-header': {
          p:1,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
        '& .widget-content': {
          p: 0,
          flexGrow: 1,
        },
        '& .widget-actions': {
          opacity: 0,
          transition: 'opacity 0.2s ease',
        },
        '&:hover .widget-actions': {
          opacity: 1,
        },
      }}
    >
      {/* 小部件头部 */}
      <Box className="widget-header" sx={{display: 'flex', alignItems: 'center' }}>
        {/* 拖拽手柄 */}
        <Box
          {...attributes}
          {...listeners}
          sx={{
            cursor: 'grab',
            opacity: 0.6,
            mr: 1,
            '&:active': {
              cursor: 'grabbing',
              opacity: 1,
            },
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <DragIndicatorIcon fontSize="small" color="action" />
        </Box>

        {/* 小部件标题 */}
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600, fontSize: '1.1rem' }}>
          {widget.title}
        </Typography>

        {/* 操作菜单 */}
        <Box className="widget-actions">
          <IconButton 
            size="small" 
            onClick={handleMenuOpen}
            sx={{
              bgcolor: alpha(theme.palette.action.hover, 0.5),
              '&:hover': {
                bgcolor: alpha(theme.palette.action.hover, 0.8),
              }
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& .MuiPaper-root': {
                  borderRadius: 2,
                  boxShadow: (theme) => theme.shadows[6],
                }
            }}
          >
            <MenuItem onClick={handleEdit}>{t('common.edit')}</MenuItem>
            <MenuItem onClick={handleDelete}>{t('common.delete')}</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* 小部件内容 */}
      <Box className="widget-content">
        {renderWidgetContent()}
      </Box>
    </Paper>
  );
}