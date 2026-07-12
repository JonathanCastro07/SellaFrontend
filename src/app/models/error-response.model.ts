// models/error-response.model.ts
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  detalles: string[] | null;
}