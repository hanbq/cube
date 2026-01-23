import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setLoadingProgress(0);
    }
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        loadingProgress,
        setLoadingProgress,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};