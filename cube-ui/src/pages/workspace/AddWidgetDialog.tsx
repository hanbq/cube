import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Widget as WidgetType } from './WorkspaceTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (widget: WidgetType) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

export default function AddWidgetDialog({ open, onClose, onAdd }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const categories = [
    { id: 'all', name: t('common.all'), icon: '📊' },
    { id: 'charts', name: t('addWidgetDialog.categories.charts'), icon: '📈' },
    { id: 'reports', name: t('addWidgetDialog.categories.reports'), icon: '📋' },
    { id: 'statistics', name: t('addWidgetDialog.categories.statistics'), icon: '🔢' },
    { id: 'other', name: t('addWidgetDialog.categories.other'), icon: '📌' },
  ];

  const allWidgets = [
    { id: 'statistic', name: t('addWidgetDialog.widgets.statistic.name'), category: 'statistics', description: t('addWidgetDialog.widgets.statistic.description'), preview: t('addWidgetDialog.widgets.statistic.preview') },
    { id: 'chart', name: t('addWidgetDialog.widgets.chart.name'), category: 'charts', description: t('addWidgetDialog.widgets.chart.description'), preview: t('addWidgetDialog.widgets.chart.preview') },
    { id: 'bar-chart', name: t('addWidgetDialog.widgets.barChart.name'), category: 'charts', description: t('addWidgetDialog.widgets.barChart.description'), preview: t('addWidgetDialog.widgets.barChart.preview') },
    { id: 'line-chart', name: t('addWidgetDialog.widgets.lineChart.name'), category: 'charts', description: t('addWidgetDialog.widgets.lineChart.description'), preview: t('addWidgetDialog.widgets.lineChart.preview') },
    { id: 'table', name: t('addWidgetDialog.widgets.table.name'), category: 'reports', description: t('addWidgetDialog.widgets.table.description'), preview: t('addWidgetDialog.widgets.table.preview') },
    { id: 'text', name: t('addWidgetDialog.widgets.text.name'), category: 'other', description: t('addWidgetDialog.widgets.text.description'), preview: t('addWidgetDialog.widgets.text.preview') },
    { id: 'activity', name: t('addWidgetDialog.widgets.activity.name'), category: 'reports', description: t('addWidgetDialog.widgets.activity.description'), preview: t('addWidgetDialog.widgets.activity.preview') },
    { id: 'calendar', name: t('addWidgetDialog.widgets.calendar.name'), category: 'other', description: t('addWidgetDialog.widgets.calendar.description'), preview: t('addWidgetDialog.widgets.calendar.preview') },
  ];

  const filteredWidgets = allWidgets.filter(widget => {
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    const matchesSearch = widget.name.toLowerCase().includes(searchTerm.toLowerCase()) || widget.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = async () => {
    if (!selectedWidget) return;
    setSubmitting(true);
    try {
      const widgetType = selectedWidget as WidgetType['type'];
      const newWidget: WidgetType = {
        id: `widget-${Date.now()}`,
        title: allWidgets.find(w => w.id === selectedWidget)?.name || t('addWidgetDialog.widgets.newWidget'),
        type: widgetType,
        size: selectedSize,
        data: widgetType === 'statistic' ? { value: '0', description: t('common.description') } : widgetType === 'text' ? { text: t('widget.textContent') } : undefined,
      };
      onAdd(newWidget);
      onClose();
      setSelectedCategory('all');
      setSelectedWidget(null);
      setSelectedSize('medium');
      setSearchTerm('');
      setTabValue(0);
    } catch (err) {
      console.error(t('addWidgetDialog.errors.addFailed'), err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWidgetSelect = (widgetId: string) => { 
    setSelectedWidget(widgetId); 
    setSelectedSize('medium'); 
    setTabValue(1); // 选择小部件后切换到大小选择标签页
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          height: '80vh',
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
          {t('addWidgetDialog.title')}
        </Typography>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label={t('addWidgetDialog.ariaLabel')}>
          <Tab label={t('addWidgetDialog.selectWidget')} />
          <Tab label={t('addWidgetDialog.selectSize')} disabled={!selectedWidget} />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 0 }}>
        <TabPanel value={tabValue} index={0}>
          {/* 搜索框 */}
          <Box sx={{ p: 2, pb: 1 }}>
            <TextField
              fullWidth
              placeholder={t('addWidgetDialog.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* 左侧类别列表 */}
            <Box sx={{ 
              width: 200, 
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`, 
              overflow: 'auto',
              bgcolor: alpha(theme.palette.background.paper, 0.5)
            }}>
              <List component="nav" dense>
                {categories.map(category => (
                  <ListItem key={category.id} disablePadding>
                    <ListItemButton
                      selected={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      sx={{ 
                        pl: 2,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        '&.Mui-selected': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                          },
                          '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.main,
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <span>{category.icon}</span>
                      </ListItemIcon>
                      <ListItemText primary={category.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
            
            {/* 右侧小部件列表 */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <Grid container spacing={2}>
                {filteredWidgets.map(widget => (
                  <Grid size ={{ xs: 12, sm:6, md: 4 }} key={widget.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedWidget === widget.id 
                          ? `2px solid ${theme.palette.primary.main}` 
                          : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        overflow: 'hidden',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-2px)',
                          boxShadow: (theme) => theme.shadows[4],
                        },
                        ...(selectedWidget === widget.id && {
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                        })
                      }}
                      onClick={() => handleWidgetSelect(widget.id)}
                    >
                      <CardContent sx={{ pb: 1.5, p: 2 }}>
                        <Typography variant="h6" component="div" gutterBottom fontWeight={600}>
                          {widget.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
                          {widget.description}
                        </Typography>
                        <Box sx={{ 
                          bgcolor: alpha(theme.palette.grey[100], 0.5), 
                          p: 1.5, 
                          borderRadius: 1.5, 
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          whiteSpace: 'pre-line',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxHeight: 60,
                          border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`
                        }}>
                          {widget.preview}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('addWidgetDialog.selectSize')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedSize === 'small' 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                        '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.shadows[4],
                  },
                  flex: 1,
                  maxWidth: 150,
                  ...(selectedSize === 'small' && {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  })
                }}
                onClick={() => setSelectedSize('small')}
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
                  border: selectedSize === 'medium' 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.shadows[4],
                  },
                  flex: 1,
                  maxWidth: 200,
                  ...(selectedSize === 'medium' && {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  })
                }}
                onClick={() => setSelectedSize('medium')}
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
                  border: selectedSize === 'large' 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.shadows[4],
                  },
                  flex: 1,
                  maxWidth: 250,
                  ...(selectedSize === 'large' && {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  })
                }}
                onClick={() => setSelectedSize('large')}
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
          </Box>
        </TabPanel>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button onClick={onClose} disabled={submitting} size="medium">
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleAdd} 
          variant="contained" 
          disabled={!selectedWidget || submitting}
          size="medium"
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: (theme) => theme.shadows[3],
          }}
        >
          {submitting ? t('common.updating') : t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}