export type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: Record<string, unknown>;
  data: T;
};
