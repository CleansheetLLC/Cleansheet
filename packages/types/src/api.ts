import { BaseEntity } from './common';

export interface ApiKey extends BaseEntity {
  userId: string;
  keyHash: string;
  name: string;
  permissions: string[];
  rateLimit: number;
  lastUsedAt?: Date;
  expiresAt?: Date;
  status: ApiKeyStatus;
}

export type ApiKeyStatus = 'active' | 'inactive' | 'revoked' | 'expired';

export interface CreateApiKeyRequest {
  name: string;
  permissions: string[];
  rateLimit?: number;
  expiresAt?: Date;
}

export interface CreateApiKeyResponse {
  id: string;
  key: string; // Only returned once during creation
  name: string;
  permissions: string[];
  rateLimit: number;
  expiresAt?: Date;
}

export interface UpdateApiKeyRequest {
  name?: string;
  permissions?: string[];
  rateLimit?: number;
  status?: ApiKeyStatus;
}

export interface ApiKeyUsage {
  keyId: string;
  requestCount: number;
  lastUsed: Date;
  rateLimitHits: number;
  errorCount: number;
  period: 'hour' | 'day' | 'month';
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId: string;
}

// Standard API error codes
export const API_ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  MFA_REQUIRED: 'MFA_REQUIRED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  
  // Authorization errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  INVALID_API_KEY: 'INVALID_API_KEY',
  API_KEY_EXPIRED: 'API_KEY_EXPIRED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // System errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

export interface RequestContext {
  requestId: string;
  userId?: string;
  organizationId?: string;
  apiKeyId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface AuditLogEntry {
  id: string;
  userId?: string;
  organizationId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface CreateAuditLogRequest {
  userId?: string;
  organizationId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}