import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

import { deepSnakeize, logOnDev } from '@/shared/lib';
import { getToken } from './token-storage.ts';

const onRequest = (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const { method, url, headers, params, data } = config;

  logOnDev(`onRequest [API] ${method?.toUpperCase()} ${url} | Request`);

  if (!headers) {
    throw new Error(`axios header is undefined`);
  }

  const token = getToken();
  const accessToken = token?.accessToken;

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (params) {
    config.params = deepSnakeize(params);
  }

  if (data) {
    config.data = deepSnakeize(data);
  }

  return Promise.resolve({ ...config } as InternalAxiosRequestConfig);
};

const onErrorRequest = async (error: AxiosError<AxiosRequestConfig>) => {
  switch (true) {
    case Boolean(error.config):
      logOnDev(`onErrorRequest: 요청 실패: ${error}`);
      break;
    case Boolean(error.request):
      logOnDev(`onErrorRequest: 응답 없음 ${error}`);
      break;
    default:
      logOnDev(`onErrorRequest: ${error}`);
      break;
  }

  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config;
  const { status } = response;

  logOnDev(`onResponse [API] ${method?.toUpperCase()} ${url} | Request ${status}`);

  return response;
};

const onErrorResponse = (error: AxiosError | Error) => {
  if (axios.isAxiosError(error)) {
    console.log('error.toJSON(): ', error.toJSON());

    const { message } = error;
    const { method, url } = error.config as AxiosRequestConfig;
    const { status, statusText } = error.response as AxiosResponse;

    logOnDev(
      `onErrorResponse [API] ${method?.toUpperCase?.()} ${url} | Error ${status} ${statusText} | ${message}`,
    );
  } else if (error.name === 'TimeoutError') {
    logOnDev(`[API] | TimeError ${error.toString()}`);
  } else {
    logOnDev(`[API] | Error ${error.toString()}`);
  }

  return Promise.reject(error);
};

export const interceptors = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onErrorRequest);
  axiosInstance.interceptors.response.use(onResponse, onErrorResponse);

  return axiosInstance;
};
