// Authentication and Authorization Types

export interface LoginCredentials {
  email: string;
  password: string;
  organizationDomain?: string;
  rememberMe?: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: AuthenticatedUser;
  tokens?: TokenPair;
  mfaRequired?: boolean;
  mfaToken?: string;
  error?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  roles: string[];
  permissions: string[];
  profilePicture?: string;
  lastLoginAt?: Date;
}

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  organizationId: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  iat: number;
  exp: number;
}

export interface MFASetupRequest {
  userId: string;
  method: 'totp' | 'sms' | 'email';
}

export interface MFASetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface MFAVerificationRequest {
  token: string;
  code: string;
}

export interface PasswordResetRequest {
  email: string;
  organizationDomain?: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface OAuthProvider {
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  enabled: boolean;
}

export interface OAuthAuthorizationRequest {
  provider: 'microsoft' | 'linkedin' | 'google';
  redirectUri: string;
  state?: string;
}

export interface OAuthCallbackRequest {
  provider: string;
  code: string;
  state?: string;
}

export interface AccountLockout {
  userId: string;
  reason: 'failed_attempts' | 'security_violation' | 'admin_action';
  lockedAt: Date;
  unlockAt?: Date;
  attemptCount: number;
}

export interface SecurityEvent {
  userId?: string;
  type: 'login_success' | 'login_failure' | 'password_change' | 'mfa_setup' | 'account_locked' | 'suspicious_activity';
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}