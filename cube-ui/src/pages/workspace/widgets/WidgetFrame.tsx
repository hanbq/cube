import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Menu, MenuItem, useTheme, alpha, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert as MoreVertIcon, DragIndicator as DragIndicatorIcon, Edit as EditIcon, Delete as DeleteIcon, AspectRatio as AspectRatioIcon } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import type { Widget } from '../../../types/workspace';

interface WidgetFrameProps {
  widget: Widget;
  children: React.ReactNode;
  onEdit: (widget: Widget) => void;
  onDelete: (id: string) => void;
  onResize?: (widget: Widget) => void;
}

export default function WidgetFrame({ widget, children, onEdit, onDelete, onResize }: WidgetFrameProps) {
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
  const handleResize = () => { 
    if (onResize) {
      onResize(widget);
    }
    handleMenuClose(); 
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
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('common.edit')}</ListItemText>
            </MenuItem>
            {onResize && (
              <MenuItem onClick={handleResize}>
                <ListItemIcon>
                  <AspectRatioIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('common.resize')}</ListItemText>
              </MenuItem>
            )}
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('common.delete')}</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* 小部件内容 */}
      <Box className="widget-content">
        {children}
      </Box>
    </Paper>
  );
}