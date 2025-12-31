import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Button,
  IconButton,
  Tooltip,
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
  Checkbox,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { sysLogService } from '../../services/sysLogService';
import type { SYSSysLog, SYSLogParam } from '../../types/syslog';

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

  const handleSelectOne = (logId: number) => {
    setSelectedLogs((prev) =>
      prev.includes(logId)
        ? prev.filter((id) => id !== logId)
        : [...prev, logId]
    );
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
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-start" flexWrap="wrap">
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        logs.some(log => selectedLogs.includes(log.logId!)) &&
                        !logs.every(log => selectedLogs.includes(log.logId!))
                      }
                      checked={
                        logs.length > 0 &&
                        logs.every(log => selectedLogs.includes(log.logId!))
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>{t('sysLogManagement.status')}</TableCell>
                  <TableCell>{t('sysLogManagement.username')}</TableCell>
                  <TableCell>{t('sysLogManagement.operation')}</TableCell>
                  <TableCell>{t('sysLogManagement.method')}</TableCell>
                  <TableCell>{t('sysLogManagement.params')}</TableCell>
                  <TableCell>{t('sysLogManagement.ip')}</TableCell>
                  <TableCell>{t('sysLogManagement.createdTime')}</TableCell>
                  <TableCell align="right">{t('sysLogManagement.operations')}</TableCell>
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
                          checked={selectedLogs.includes(log.logId!)}
                          onChange={() => handleSelectOne(log.logId!)}
                        />
                      </TableCell>
                      <TableCell>{log.logId}</TableCell>
                      <TableCell>{log.status || '-'}</TableCell>
                      <TableCell>{log.username || '-'}</TableCell>
                      <TableCell>{log.operation || '-'}</TableCell>
                      <TableCell>{log.method || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <Tooltip title={log.params || '-'}>
                            <span>{log.params || '-'}</span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>{log.ip || '-'}</TableCell>
                      <TableCell>
                        {log.createdTime
                          ? new Date(log.createdTime).toLocaleString()
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('sysLogManagement.delete')}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteLog(log.logId!)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
          </TableContainer>
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