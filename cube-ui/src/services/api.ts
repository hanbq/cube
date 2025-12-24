import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// In development, use relative path (will be proxied by Vite)
// In production, use the full URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add token to headers
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors globally
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;

          switch (status) {
            case 401:
              // Unauthorized - clear auth and redirect to login
              console.error('Unauthorized - clearing authentication');
              localStorage.removeItem('token');
              localStorage.removeItem('userInfo');
              window.location.href = '/';
              break;
            case 403:
              console.error('Forbidden - insufficient permissions');
              break;
            case 404:
              console.error('Resource not found');
              break;
            case 500:
              console.error('Internal server error');
              break;
            default:
              console.error(`API error with status ${status}:`, error.message);
          }
        } else if (error.request) {
          // Request made but no response received
          console.error('No response received from server:', error.message);
        } else {
          // Error in request setup
          console.error('Request setup error:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(endpoint, config);
    return response.data;
  }

  // Get the axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const apiService = new ApiService(API_BASE_URL);
