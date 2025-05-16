'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AlertTitle } from '@mui/material';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertState {
  open: boolean;
  message: string;
  severity: AlertType;
}

interface AlertContextType {
  showAlert: (alertData: { message: string; severity?: AlertType; error?: any }) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showAlert = ({ message, severity = 'info', error }: { message: string; severity?: AlertType; error?: any }) => {
    const errorMsg = error ? error?.response?.data?.detail || error?.message : null;
    setAlert({
      open: true,
      message: errorMsg || message,
      severity,
    });
  };

  const handleClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={alert.severity} variant="standard" sx={{ maxWidth: 500 }}>
          <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
          <div dangerouslySetInnerHTML={{ __html: alert.message }} />
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
