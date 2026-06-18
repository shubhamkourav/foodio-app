import { ApiClientError } from '@/types/api';

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

export function getErrorMessage(error: unknown, fallback = DEFAULT_MESSAGE): string {
  if (error instanceof ApiClientError) {
    return error.getDisplayMessage();
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return fallback;
}

export function getValidationErrors(error: unknown): string[] {
  if (error instanceof ApiClientError && error.errors.length > 0) {
    return error.errors;
  }

  return [];
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}
