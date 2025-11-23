export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
}
