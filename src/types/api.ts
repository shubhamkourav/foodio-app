export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  pagination?: PaginationMeta;
  errors?: string[];
}

export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors: string[] = [],
  ) {
    super(message);
    this.name = 'ApiClientError';
  }

  getDisplayMessage(): string {
    if (this.statusCode === 0) {
      return this.message;
    }

    if (this.errors.length === 1) {
      return this.errors[0];
    }

    return this.message || 'Request failed';
  }
}
