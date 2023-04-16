import axios, { AxiosInstance , AxiosError, InternalAxiosRequestConfig } from 'axios';

import { useEffect } from 'react';


const HttpService = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.REACT_URL,
  });

  // Request Handler
  const requestHandler = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
    const token = localStorage.getItem('token');
    if (token) {
      switch (config.url) {
        case process.env.APP_LOGIN:
          return config;
        default:
          if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
      }
    }
    return config;
  };

  // Request Error Handler
  const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
  };

  // Response Handler
  const responseHandler = (response: any) => {
    return response;
  };

  // Response Error Handler
  const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[response error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
  };


  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(requestHandler, onRequestError);
    const responseInterceptor = instance.interceptors.response.use(responseHandler, onResponseError);

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  });

  return instance;
};

export default HttpService;
