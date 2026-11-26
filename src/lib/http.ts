import { ToastContext } from "@/providers/ToastProvider";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { redirect } from "next/navigation";

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
  // "Access-Control-Allow-Credentials": true,
  "X-Requested-With": "XMLHttpRequest",
};

// We can use the injectToken function to inject the JWT token through an interceptor
// We get the `accessToken` from the `localStorage` which is stored during the authentication process
const injectToken = (config: AxiosRequestConfig): AxiosRequestConfig => {
  try {
    const token = localStorage.getItem("accessToken");

    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // API tính giờ theo múi giờ của trình duyệt (tiệm ở Mỹ); thiếu header thì API dùng America/New_York
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && config.headers) {
      config.headers["X-Timezone"] = timeZone;
    }
    return config;
  } catch (error) {
    throw new Error(error);
  }
};

class Http {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {
    const http = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers,
      //withCredentials: true,
    });

    http.interceptors.request.use(injectToken, (error) =>
      Promise.reject(error),
    );

    http.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;
        return this.handleError(response);
      },
    );

    this.instance = http;
    return http;
  }

  request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }

  // Handle global app errors
  // We can handle generic app errors depending on the status code
  private handleError(error: any) {
    const { status } = error;

    switch (status) {
      case StatusCode.InternalServerError: {
        // Handle InternalServerError
        break;
      }
      case StatusCode.Forbidden: {
        // Handle Forbidden
        break;
      }
      case StatusCode.Unauthorized: {
        localStorage.removeItem("accessToken");
        redirect("/auth/signin");
        break;
      }
      case StatusCode.TooManyRequests: {
        // Handle TooManyRequests
        break;
      }
    }

    return Promise.reject(error);
  }
}

export const http = new Http();

/**
 * Lấy câu thông báo lỗi từ API. Interceptor ở trên reject bằng chính `response` của axios
 * (không phải AxiosError), nên message nằm ở `error.data`, không phải `error.response.data`.
 */
export const apiErrorMessage = (error: any, fallback: string): string => {
  const data = error?.data ?? error?.response?.data;
  const meta = data?.metadata;
  return (
    data?.message ||
    data?.error ||
    (Array.isArray(meta) ? meta[0] : typeof meta === "string" ? meta : "") ||
    fallback
  );
};
