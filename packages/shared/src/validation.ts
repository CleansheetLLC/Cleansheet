import Joi from 'joi';

// Common validation schemas
export const commonSchemas = {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')).required(),
  uuid: Joi.string().uuid().required(),
  organizationDomain: Joi.string().hostname().required(),
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  url: Joi.string().uri().optional(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
};

// User validation schemas
export const userValidation = {
  createUser: Joi.object({
    organizationId: commonSchemas.uuid,
    email: commonSchemas.email,
    firstName: commonSchemas.name,
    lastName: commonSchemas.name,
    password: commonSchemas.password.optional(),
    roles: Joi.array().items(Joi.string()).optional(),
    profileData: Joi.object().optional(),
    preferences: Joi.object().optional(),
  }),

  updateUser: Joi.object({
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
    profilePicture: commonSchemas.url,
    profileData: Joi.object().optional(),
    preferences: Joi.object().optional(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonSchemas.password,
  }),
};

// Authentication validation schemas
export const authValidation = {
  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required(),
    organizationDomain: commonSchemas.organizationDomain.optional(),
    rememberMe: Joi.boolean().optional(),
  }),

  mfaSetup: Joi.object({
    userId: commonSchemas.uuid,
    method: Joi.string().valid('totp', 'sms', 'email').required(),
  }),

  mfaVerification: Joi.object({
    token: Joi.string().required(),
    code: Joi.string().length(6).pattern(/^\d+$/).required(),
  }),

  passwordReset: Joi.object({
    email: commonSchemas.email,
    organizationDomain: commonSchemas.organizationDomain.optional(),
  }),

  passwordResetConfirm: Joi.object({
    token: Joi.string().required(),
    newPassword: commonSchemas.password,
  }),

  oauthCallback: Joi.object({
    provider: Joi.string().valid('microsoft', 'linkedin', 'google').required(),
    code: Joi.string().required(),
    state: Joi.string().optional(),
  }),
};

// Organization validation schemas
export const organizationValidation = {
  createOrganization: Joi.object({
    name: commonSchemas.name,
    domain: commonSchemas.organizationDomain,
    adminEmail: commonSchemas.email,
    adminFirstName: commonSchemas.name,
    adminLastName: commonSchemas.name,
    adminPassword: commonSchemas.password,
    settings: Joi.object().optional(),
  }),

  updateOrganization: Joi.object({
    name: commonSchemas.name.optional(),
    domain: commonSchemas.organizationDomain.optional(),
    settings: Joi.object().optional(),
    status: Joi.string().valid('active', 'suspended', 'pending', 'trial', 'expired').optional(),
  }),

  inviteUser: Joi.object({
    email: commonSchemas.email,
    roles: Joi.array().items(Joi.string()).min(1).required(),
    message: Joi.string().max(500).optional(),
  }),
};

// Role validation schemas
export const roleValidation = {
  createRole: Joi.object({
    organizationId: commonSchemas.uuid,
    name: Joi.string().min(1).max(50).pattern(/^[a-z_]+$/).required(),
    description: commonSchemas.description,
    permissions: Joi.array().items(
      Joi.object({
        resource: Joi.string().required(),
        action: Joi.string().required(),
        conditions: Joi.array().items(
          Joi.object({
            field: Joi.string().required(),
            operator: Joi.string().valid('equals', 'not_equals', 'contains', 'not_contains', 'in', 'not_in', 'greater_than', 'less_than').required(),
            value: Joi.any().required(),
          })
        ).optional(),
      })
    ).required(),
  }),

  updateRole: Joi.object({
    name: Joi.string().min(1).max(50).pattern(/^[a-z_]+$/).optional(),
    description: commonSchemas.description,
    permissions: Joi.array().items(
      Joi.object({
        resource: Joi.string().required(),
        action: Joi.string().required(),
        conditions: Joi.array().items(
          Joi.object({
            field: Joi.string().required(),
            operator: Joi.string().valid('equals', 'not_equals', 'contains', 'not_contains', 'in', 'not_in', 'greater_than', 'less_than').required(),
            value: Joi.any().required(),
          })
        ).optional(),
      })
    ).optional(),
  }),

  assignRole: Joi.object({
    userId: commonSchemas.uuid,
    roleId: commonSchemas.uuid,
  }),
};

// API Key validation schemas
export const apiKeyValidation = {
  createApiKey: Joi.object({
    name: commonSchemas.name,
    permissions: Joi.array().items(Joi.string()).min(1).required(),
    rateLimit: Joi.number().integer().min(1).max(10000).optional(),
    expiresAt: Joi.date().greater('now').optional(),
  }),

  updateApiKey: Joi.object({
    name: commonSchemas.name.optional(),
    permissions: Joi.array().items(Joi.string()).min(1).optional(),
    rateLimit: Joi.number().integer().min(1).max(10000).optional(),
    status: Joi.string().valid('active', 'inactive', 'revoked', 'expired').optional(),
  }),
};

// Pagination validation schema
export const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
});

// Validation helper function
export function validateSchema<T>(schema: Joi.Schema, data: any): T {
  const { error, value } = schema.validate(data, { 
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  
  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    
    throw new ValidationError('Validation failed', details);
  }
  
  return value as T;
}

export class ValidationError extends Error {
  public readonly details: Array<{ field: string; message: string }>;
  
  constructor(message: string, details: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}