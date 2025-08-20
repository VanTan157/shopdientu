export interface IApiResponse<T> {
  data?: T;
  message: string;
  success?: boolean;
  error?: string;
  statusCode?: number;
}
