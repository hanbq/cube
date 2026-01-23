import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';

const ErrorDisplay: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 监听未捕获的Promise拒绝
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason) {
        setError(event.reason.message);
      }
    };

    // 监听全局错误
    const handleError = (event: ErrorEvent) => {
      setError(event.message);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  const handleClose = () => {
    setError(null);
  };

  return (
    <Snackbar 
      open={!!error} 
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity="error" 
        sx={{ width: '100%' }}
      >
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorDisplay;