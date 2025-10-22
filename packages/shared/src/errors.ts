import { API_ERROR_CODES } from '@cleansheet/types';

export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  public readonly isOperational: boolean = true;

  constructor(message: string, public readonly details?: any) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

// Authentication Errors (401)
export class AuthenticationError extends BaseError {
  readonly statusCode = 401;
  readonly code = API_ERROR_CODES.INVALID_CREDENTIALS;
}

export class TokenExpiredError extends BaseError {
  readonly statusCode = 401;
  readonly code = API_ERROR_CODES.TOKEN_EXPIRED;
}

export class InvalidTokenError extends BaseError {
  readonly statusCode = 401;
  readonly code = API_ERROR_CODES.TOKEN_INVALID;
}

export class MFARequiredError extends BaseError {
  readonly statusCode = 401;
  readonly code = API_ERROR_CODES.MFA_REQUIRED;
}

export class AccountLockedError extends BaseError {
  readonly statusCode = 401;
  readonly code = API_ERROR_CODES.ACCOUNT_LOCKED;
}

// Authorization Errors (403)
export class AuthorizationError extends BaseError {
  readonly statusCode = 403;
  readonly code = API_ERROR_CODES.INSUFFICIENT_PERMISSIONS;
}

export class InvalidApiKeyError extends BaseError {
  readonly statusCode = 403;
  readonly code = API_ERROR_CODES.INVALID_API_KEY;
}

export class ApiKeyExpiredError extends BaseError {
  readonly statusCode = 403;
  readonly code = API_ERROR_CODES.API_KEY_EXPIRED;
}

// Rate Limiting Errors (429)
export class RateLimitExceededError extends BaseError {
  readonly statusCode = 429;
  readonly code = API_ERROR_CODES.RATE_LIMIT_EXCEEDED;
}

// Validation Errors (400)
export class ValidationError extends BaseError {
  readonly statusCode = 400;
  readonly code = API_ERROR_CODES.VALIDATION_ERROR;
}

export class InvalidInputError extends BaseError {
  readonly statusCode = 400;
  readonly code = API_ERROR_CODES.INVALID_INPUT;
}

export class MissingRequiredFieldError extends BaseError {
  readonly statusCode = 400;
  readonly code = API_ERROR_CODES.MISSING_REQUIRED_FIELD;
}

// Resource Errors (404, 409)
export class ResourceNotFoundError extends BaseError {
  readonly statusCode = 404;
  readonly code = API_ERROR_CODES.RESOURCE_NOT_FOUND;
}

export class ResourceAlreadyExistsError extends BaseError {
  readonly statusCode = 409;
  readonly code = API_ERROR_CODES.RESOURCE_ALREADY_EXISTS;
}

export class ResourceConflictError extends BaseError {
  readonly statusCode = 409;
  readonly code = API_ERROR_CODES.RESOURCE_CONFLICT;
}

// System Errors (500, 503)
export class InternalServerError extends BaseError {
  readonly statusCode = 500;
  readonly code = API_ERROR_CODES.INTERNAL_SERVER_ERROR;
  readonly isOperational = false;
}

export class ServiceUnavailableError extends BaseError {
  readonly statusCode = 503;
  readonly code = API_ERROR_CODES.SERVICE_UNAVAILABLE;
}

export class DatabaseError extends BaseError {
  readonly statusCode = 500;
  readonly code = API_ERROR_CODES.DATABASE_ERROR;
  readonly isOperational = false;
}

export class ExternalServiceError extends BaseError {
  readonly statusCode = 502;
  readonly code = API_ERROR_CODES.EXTERNAL_SERVICE_ERROR;
}

// Error factory functions
export function createAuthenticationError(message: string = 'Invalid credentials'): AuthenticationError {
  return new AuthenticationError(message);
}

export function createAuthorizationError(message: string = 'Insufficient permissions'): AuthorizationError {
  return new AuthorizationError(message);
}

export function createValidationError(message: string, details?: any): ValidationError {
  return new ValidationError(message, details);
}

export function createResourceNotFoundError(resource: string, id?: string): ResourceNotFoundError {
  const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
  return new ResourceNotFoundError(message, { resource, id });
}

export function createResourceAlreadyExistsError(resource: string, field?: string, value?: string): ResourceAlreadyExistsError {
  const message = field && value 
    ? `${resource} with ${field} '${value}' already exists`
    : `${resource} already exists`;
  return new ResourceAlreadyExistsError(message, { resource, field, value });
}

// Error type guards
export function isOperationalError(error: Error): boolean {
  return error instanceof BaseError && error.isOperational;
}

export function isAuthenticationError(error: Error): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

export function isAuthorizationError(error: Error): error is AuthorizationError {
  return error instanceof AuthorizationError;
}

export function isValidationError(error: Error): error is ValidationError {
  return error instanceof ValidationError;
}

export function isResourceNotFoundError(error: Error): error is ResourceNotFoundError {
  return error instanceof ResourceNotFoundError;
}

// Error handler utility
export function handleError(error: Error): { statusCode: number; body: any } {
  if (error instanceof BaseError) {
    return {
      statusCode: error.statusCode,
      body: {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  // Handle unknown errors
  return {
    statusCode: 500,
    body: {
      success: false,
      error: {
        code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
      },
    },
  };
}