import { BaseEntity } from './common';

export interface Organization extends BaseEntity {
  name: string;
  domain: string;
  settings: OrganizationSettings;
  status: OrganizationStatus;
  subscriptionId?: string;
  billingEmail?: string;
  adminUserId: string;
}

export interface OrganizationSettings {
  branding: BrandingSettings;
  authentication: AuthenticationSettings;
  security: SecuritySettings;
  features: FeatureSettings;
  integrations: IntegrationSettings;
}

export interface BrandingSettings {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain?: string;
  companyName?: string;
  supportEmail?: string;
}

export interface AuthenticationSettings {
  passwordPolicy: PasswordPolicy;
  mfaRequired: boolean;
  mfaGracePeriod: number; // days
  sessionTimeout: number; // minutes
  maxConcurrentSessions: number;
  oauthProviders: OAuthProviderConfig[];
  ssoEnabled: boolean;
  ssoConfig?: SSOConfig;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number; // days, 0 = never expires
  preventReuse: number; // number of previous passwords to check
  lockoutThreshold: number; // failed attempts before lockout
  lockoutDuration: number; // minutes
}

export interface OAuthProviderConfig {
  provider: 'microsoft' | 'linkedin' | 'google';
  clientId: string;
  clientSecret: string;
  enabled: boolean;
  autoCreateUsers: boolean;
  defaultRoles: string[];
}

export interface SSOConfig {
  protocol: 'saml' | 'oidc';
  entityId: string;
  ssoUrl: string;
  certificate: string;
  attributeMapping: {
    email: string;
    firstName: string;
    lastName: string;
    roles?: string;
  };
}

export interface SecuritySettings {
  ipWhitelist: string[];
  allowedCountries: string[];
  requireDeviceVerification: boolean;
  auditLogRetention: number; // days
  dataRetention: number; // days
  encryptionAtRest: boolean;
}

export interface FeatureSettings {
  maxUsers: number;
  maxStorage: number; // GB
  maxApiCalls: number; // per month
  enabledFeatures: string[];
  customFeatures: Record<string, any>;
}

export interface IntegrationSettings {
  webhooks: WebhookConfig[];
  apiKeys: ApiKeyConfig[];
  externalServices: ExternalServiceConfig[];
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
}

export interface ApiKeyConfig {
  id: string;
  name: string;
  permissions: string[];
  rateLimit: number;
  enabled: boolean;
}

export interface ExternalServiceConfig {
  service: string;
  config: Record<string, any>;
  enabled: boolean;
}

export type OrganizationStatus = 'active' | 'suspended' | 'pending' | 'trial' | 'expired';

export interface CreateOrganizationRequest {
  name: string;
  domain: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPassword: string;
  settings?: Partial<OrganizationSettings>;
}

export interface UpdateOrganizationRequest {
  name?: string;
  domain?: string;
  settings?: Partial<OrganizationSettings>;
  status?: OrganizationStatus;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  roles: string[];
  invitedBy: string;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

export interface InviteUserRequest {
  email: string;
  roles: string[];
  message?: string;
}

export interface AcceptInvitationRequest {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
}