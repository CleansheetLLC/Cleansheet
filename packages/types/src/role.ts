import { BaseEntity } from './common';

export interface Role extends BaseEntity {
  organizationId: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
  userCount?: number;
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: any;
}

export interface CreateRoleRequest {
  organizationId: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: Permission[];
}

export interface AssignRoleRequest {
  userId: string;
  roleId: string;
}

export interface RoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy: string;
}

// Predefined system permissions
export const SYSTEM_PERMISSIONS = {
  // User management
  USER_CREATE: { resource: 'user', action: 'create' },
  USER_READ: { resource: 'user', action: 'read' },
  USER_UPDATE: { resource: 'user', action: 'update' },
  USER_DELETE: { resource: 'user', action: 'delete' },
  USER_INVITE: { resource: 'user', action: 'invite' },
  
  // Profile management
  PROFILE_READ: { resource: 'profile', action: 'read' },
  PROFILE_UPDATE: { resource: 'profile', action: 'update' },
  PROFILE_DELETE: { resource: 'profile', action: 'delete' },
  
  // Organization management
  ORG_READ: { resource: 'organization', action: 'read' },
  ORG_UPDATE: { resource: 'organization', action: 'update' },
  ORG_DELETE: { resource: 'organization', action: 'delete' },
  ORG_SETTINGS: { resource: 'organization', action: 'settings' },
  
  // Role management
  ROLE_CREATE: { resource: 'role', action: 'create' },
  ROLE_READ: { resource: 'role', action: 'read' },
  ROLE_UPDATE: { resource: 'role', action: 'update' },
  ROLE_DELETE: { resource: 'role', action: 'delete' },
  ROLE_ASSIGN: { resource: 'role', action: 'assign' },
  
  // API key management
  API_KEY_CREATE: { resource: 'api_key', action: 'create' },
  API_KEY_READ: { resource: 'api_key', action: 'read' },
  API_KEY_UPDATE: { resource: 'api_key', action: 'update' },
  API_KEY_DELETE: { resource: 'api_key', action: 'delete' },
  
  // Audit and compliance
  AUDIT_READ: { resource: 'audit', action: 'read' },
  AUDIT_EXPORT: { resource: 'audit', action: 'export' },
  
  // System administration
  SYSTEM_ADMIN: { resource: '*', action: '*' },
} as const;

// Predefined system roles
export const SYSTEM_ROLES = {
  SUPER_ADMIN: {
    name: 'super_admin',
    description: 'Super Administrator with full system access',
    permissions: [SYSTEM_PERMISSIONS.SYSTEM_ADMIN],
    isSystemRole: true,
  },
  ORG_ADMIN: {
    name: 'org_admin',
    description: 'Organization Administrator',
    permissions: [
      SYSTEM_PERMISSIONS.USER_CREATE,
      SYSTEM_PERMISSIONS.USER_READ,
      SYSTEM_PERMISSIONS.USER_UPDATE,
      SYSTEM_PERMISSIONS.USER_DELETE,
      SYSTEM_PERMISSIONS.USER_INVITE,
      SYSTEM_PERMISSIONS.ROLE_CREATE,
      SYSTEM_PERMISSIONS.ROLE_READ,
      SYSTEM_PERMISSIONS.ROLE_UPDATE,
      SYSTEM_PERMISSIONS.ROLE_DELETE,
      SYSTEM_PERMISSIONS.ROLE_ASSIGN,
      SYSTEM_PERMISSIONS.ORG_READ,
      SYSTEM_PERMISSIONS.ORG_UPDATE,
      SYSTEM_PERMISSIONS.ORG_SETTINGS,
      SYSTEM_PERMISSIONS.API_KEY_CREATE,
      SYSTEM_PERMISSIONS.API_KEY_READ,
      SYSTEM_PERMISSIONS.API_KEY_UPDATE,
      SYSTEM_PERMISSIONS.API_KEY_DELETE,
      SYSTEM_PERMISSIONS.AUDIT_READ,
      SYSTEM_PERMISSIONS.AUDIT_EXPORT,
    ],
    isSystemRole: true,
  },
  USER: {
    name: 'user',
    description: 'Standard User',
    permissions: [
      SYSTEM_PERMISSIONS.PROFILE_READ,
      SYSTEM_PERMISSIONS.PROFILE_UPDATE,
    ],
    isSystemRole: true,
  },
  RECRUITER: {
    name: 'recruiter',
    description: 'Recruiter with access to candidate profiles',
    permissions: [
      SYSTEM_PERMISSIONS.PROFILE_READ,
      SYSTEM_PERMISSIONS.USER_READ,
      SYSTEM_PERMISSIONS.API_KEY_CREATE,
      SYSTEM_PERMISSIONS.API_KEY_READ,
    ],
    isSystemRole: true,
  },
  COACH: {
    name: 'coach',
    description: 'Career Coach with learner management capabilities',
    permissions: [
      SYSTEM_PERMISSIONS.PROFILE_READ,
      SYSTEM_PERMISSIONS.USER_READ,
    ],
    isSystemRole: true,
  },
} as const;