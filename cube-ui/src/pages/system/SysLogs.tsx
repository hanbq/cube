import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Stack,
  Select,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Chip,
  Checkbox,
  IconButton,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { sysLogService } from '../../services/sysLogService';
import type { SYSSysLog, SYSLogParam } from '../../types/syslog';
import { LOG_STATUS } from '../../constants/logConstants';

export default function SysLogs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<SYSSysLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [queryState, setQueryState] = useState({
    searchUsername: '',
    searchOperation: '',
    searchMethod: '',
    searchStatus: '',
    searchIp: '',
    searchCreatedTimeStart: '',
    searchCreatedTimeEnd: '',
    page: 0,
    rowsPerPage: 20,
  });

  const performSearch = async (pageNum: number, pageSize: number) => {
    setLoading(true);
    setError(null);
    try {
      const param: SYSLogParam = {
        pageNum: pageNum + 1,
        pageSize: pageSize,
        username: queryState.searchUsername || undefined,
        operation: queryState.searchOperation || undefined,
        method: queryState.searchMethod || undefined,
        status: queryState.searchStatus || undefined,
        ip: queryState.searchIp || undefined,
        createdTimeStart: queryState.searchCreatedTimeStart || undefined,
        createdTimeEnd: queryState.searchCreatedTimeEnd || undefined,
      };
      const result = await sysLogService.searchSysLogs(param);
      setLogs(result.records);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setQueryState(prev => ({ ...prev, page: 0 }));
    await performSearch(0, queryState.rowsPerPage);
  };

  const handleChangePage = async (event: unknown, newPage: number) => {
    setQueryState(prev => ({ ...prev, page: newPage }));
    await performSearch(newPage, queryState.rowsPerPage);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setQueryState(prev => ({ ...prev, rowsPerPage: newRowsPerPage, page: 0 }));
    await performSearch(0, newRowsPerPage);
  };

  React.useEffect(() => {
    performSearch(0, queryState.rowsPerPage);
  }, []);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const currentPageIds = logs
        .filter((log) => log.logId)
        .map((log) => log.logId!);
      const newSelected = [...new Set([...selectedLogs, ...currentPageIds])];
      setSelectedLogs(newSelected);
    } else {
      const currentPageIds = logs
        .filter((log) => log.logId)
        .map((log) => log.logId!);
      setSelectedLogs(selectedLogs.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSelectAll(event);
  };

  const handleSelectOne = (logId: number) => {
    setSelectedLogs((prev) =>
      prev.includes(logId)
        ? prev.filter((id) => id !== logId)
        : [...prev, logId]
    );
  };

  const handleSelectClick = (logId: number) => {
    handleSelectOne(logId);
  };

  const handleDeleteLog = async (logId: number) => {
    if (window.confirm(t('sysLogManagement.confirmDelete'))) {
      try {
        await sysLogService.deleteSysLog(logId);
        setSnackbar({
          open: true,
          message: t('sysLogManagement.deleteSuccess'),
          severity: 'success',
        });
        await performSearch(queryState.page, queryState.rowsPerPage);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      }
    }
  };

  const handleDelete = async (logId: number) => {
    handleDeleteLog(logId);
  };

  const handleBatchDelete = async () => {
    if (selectedLogs.length === 0) {
      setSnackbar({
        open: true,
        message: t('sysLogManagement.selectFirst'),
        severity: 'error',
      });
      return;
    }

    if (window.confirm(t('sysLogManagement.confirmBatchDelete', { count: selectedLogs.length }))) {
      try {
        await sysLogService.batchDeleteSysLogs(selectedLogs);
        setSelectedLogs([]);
        setSnackbar({
          open: true,
          message: t('sysLogManagement.batchDeleteSuccess'),
          severity: 'success',
        });
        await performSearch(queryState.page, queryState.rowsPerPage);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      }
    }
  };

  return (
    <Box sx={{ m: -3 }}>
      <Paper sx={{ p: 3 }}>
        {/* 工具栏 */}
        <Box 
          sx={{ 
            mb: 3,
            p: 2,
            border: 1,
            borderColor: 'grey.300',
            borderRadius: 1,
            backgroundColor: 'grey.50'
          }}
        >
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center" 
            justifyContent="flex-start"
            flexWrap="wrap"
            sx={{ gap: 2 }}
          >
            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel id="status-select-label">{t('sysLogManagement.status')}</InputLabel>
              <Select
                labelId="status-select-label"
                value={queryState.searchStatus}
                label={t('sysLogManagement.status')}
                onChange={(e) => setQueryState(prev => ({ ...prev, searchStatus: e.target.value }))}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                <MenuItem value="success">{t('common.success')}</MenuItem>
                <MenuItem value="failure">{t('common.failure')}</MenuItem>
                <MenuItem value="error">{t('common.error')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t('sysLogManagement.username')}
              size="small"
              value={queryState.searchUsername}
              onChange={(e) => setQueryState(prev => ({ ...prev, searchUsername: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ width: 150 }}
            />
            <TextField
              label={t('sysLogManagement.operation')}
              size="small"
              value={queryState.searchOperation}
              onChange={(e) => setQueryState(prev => ({ ...prev, searchOperation: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ width: 150 }}
            />
            <TextField
              label={t('sysLogManagement.method')}
              size="small"
              value={queryState.searchMethod}
              onChange={(e) => setQueryState(prev => ({ ...prev, searchMethod: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ width: 150 }}
            />
            
            <TextField
              label={t('sysLogManagement.ip')}
              size="small"
              value={queryState.searchIp}
              onChange={(e) => setQueryState(prev => ({ ...prev, searchIp: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ width: 150 }}
            />
            <TextField
              label={t('sysLogManagement.createdTimeStart')}
              type="datetime-local"
              size="small"
              value={queryState.searchCreatedTimeStart}
              onChange={(e) => setQueryState(prev => ({ ...prev, searchCreatedTimeStart: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 200 }}
            />
            <TextField
              label={t('sysLogManagement.createdTimeEnd')}
              type="datetime-local"
              size="small"
              value={queryState.searchCreatedTimeEnd}
              onChange={(e) => setQueryState(prev => ({ ...prev, searchCreatedTimeEnd: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 200 }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              {t('sysLogManagement.search')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
              disabled={selectedLogs.length === 0}
            >
              {t('sysLogManagement.batchDelete')}
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            height: 'calc(100vh - 300px)', 
            minHeight: 400,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <TableContainer sx={{ 
              flex: 1, 
              overflow: 'auto',
              border: '1px solid rgba(224, 224, 224, 1)',
              borderRadius: 1
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={selectedLogs.length > 0 && selectedLogs.length < logs.length}
                        checked={logs.length > 0 && selectedLogs.length === logs.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>{t('sysLogManagement.status')}</TableCell>
                    <TableCell>{t('sysLogManagement.username')}</TableCell>
                    <TableCell>{t('sysLogManagement.operation')}</TableCell>
                    <TableCell>{t('sysLogManagement.method')}</TableCell>
                    <TableCell>{t('sysLogManagement.params')}</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>{t('sysLogManagement.createdTime')}</TableCell>
                    <TableCell>{t('sysLogManagement.ip')}</TableCell>
                    <TableCell>{t('sysLogManagement.operations')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        {t('sysLogManagement.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.logId} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={selectedLogs.includes(log.logId)}
                            onChange={() => handleSelectClick(log.logId)}
                          />
                        </TableCell>
                        <TableCell>{log.logId}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.status === LOG_STATUS.SUCCESS ? t('common.success') : t('common.failure')}
                            color={log.status === LOG_STATUS.SUCCESS ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{log.username || '-'}</TableCell>
                        <TableCell>{log.operation}</TableCell>
                        <TableCell>{log.method}</TableCell>
                        <TableCell>
                          {log.params ? (
                            <Tooltip title={JSON.stringify(log.params, null, 2)} arrow>
                              <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {JSON.stringify(log.params)}
                              </Typography>
                            </Tooltip>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell sx={{ minWidth: 180 }}>
                          {log.createdTime ? new Date(log.createdTime).toLocaleString() : '-'}
                        </TableCell>
                        <TableCell>{log.ip || '-'}</TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(log.logId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              component="div"
              count={total}
              rowsPerPage={queryState.rowsPerPage}
              page={queryState.page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={t('sysLogManagement.rowsPerPage')}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t('common.of')} ${count !== -1 ? count : `${to}+`} ${t('common.items')}`
              }
            />
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}