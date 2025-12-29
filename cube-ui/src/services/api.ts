import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import i18n from '../i18n';

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
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

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

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
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
        // 检查业务层面的认证失败
        const apiResponse = response.data as ApiResponse<any>;
        if (apiResponse && (apiResponse.code === 401 || apiResponse.message?.includes('未授权') || apiResponse.message?.includes('token'))) {
          console.error(i18n.t('errors.tokenInvalidOrExpired'));
          this.handleUnauthorized();
          return Promise.reject(new Error(i18n.t('errors.unauthorized')));
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response) {
          // Server responded with error status
          const status = error.response.status;

          switch (status) {
            case 401:
              // Unauthorized - attempt token refresh
              console.log('收到401错误，尝试刷新token');

              // 避免无限循环：如果是刷新token接口本身失败，直接登出
              if (originalRequest.url?.includes('/auth/refresh-token')) {
                console.error('Token刷新接口返回401，跳转登录页');
                this.handleUnauthorized();
                return Promise.reject(error);
              }

              // 如果已经在刷新token，将请求加入队列
              if (this.isRefreshing) {
                console.log('Token刷新中，请求加入队列');
                return new Promise((resolve, reject) => {
                  this.failedQueue.push({ resolve, reject });
                })
                  .then(token => {
                    // 用新token重试原始请求
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return this.axiosInstance.request(originalRequest);
                  })
                  .catch(err => {
                    return Promise.reject(err);
                  });
              }

              // 开始刷新token
              this.isRefreshing = true;
              originalRequest._retry = true;

              try {
                // 动态导入authService避免循环依赖
                const { authService } = await import('./authService');
                const newToken = await authService.refreshToken();

                console.log('Token刷新成功，重试队列中的请求');
                this.isRefreshing = false;
                this.processQueue(null, newToken);

                // 用新token重试原始请求
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                return this.axiosInstance.request(originalRequest);
              } catch (refreshError) {
                console.error('Token刷新失败:', refreshError);
                this.isRefreshing = false;
                this.processQueue(refreshError, null);
                this.handleUnauthorized();
                return Promise.reject(refreshError);
              }

            case 403:
              console.error(i18n.t('errors.forbidden'));
              break;
            case 404:
              console.error(i18n.t('errors.notFound'));
              break;
            case 500:
              console.error(i18n.t('errors.serverError'));
              break;
            default:
              console.error(i18n.t('errors.apiError', { status, message: error.message }));
          }
        } else if (error.request) {
          // Request made but no response received
          console.error(i18n.t('errors.noResponse', { message: error.message }));
        } else {
          // Error in request setup
          console.error(i18n.t('errors.requestSetupError', { message: error.message }));
        }

        return Promise.reject(error);
      }
    );
  }

  private handleUnauthorized() {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');

    // Redirect to login page only if not already there
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, config);
    const apiResponse = response.data;
    if (apiResponse.code !== 200) {
      throw new Error(apiResponse.message || i18n.t('errors.requestFailed'));
    }
    return apiResponse;
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data, config);
    const apiResponse = response.data;
    if (apiResponse.code !== 200) {
      throw new Error(apiResponse.message || i18n.t('errors.requestFailed'));
    }
    return apiResponse;
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(endpoint, data, config);
    const apiResponse = response.data;
    if (apiResponse.code !== 200) {
      throw new Error(apiResponse.message || i18n.t('errors.requestFailed'));
    }
    return apiResponse;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(endpoint, config);
    const apiResponse = response.data;
    if (apiResponse.code !== 200) {
      throw new Error(apiResponse.message || i18n.t('errors.requestFailed'));
    }
    return apiResponse;
  }

  // Get the axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const apiService = new ApiService(API_BASE_URL);
