import jwt from 'jsonwebtoken';
import { JWTPayload, RefreshTokenPayload, JWTConfig } from '@cleansheet/types';

export class JWTUtils {
  private static config: JWTConfig;

  static configure(config: JWTConfig) {
    this.config = config;
  }

  /**
   * Generate an access token
   */
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss' | 'aud'>): string {
    const now = Math.floor(Date.now() / 1000);
    
    const fullPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + this.parseExpiresIn(this.config.expiresIn),
      iss: this.config.issuer,
      aud: this.config.audience,
    };

    return jwt.sign(fullPayload, this.config.secret, {
      algorithm: 'HS256',
    });
  }

  /**
   * Generate a refresh token
   */
  static generateRefreshToken(userId: string, tokenId: string): string {
    const now = Math.floor(Date.now() / 1000);
    
    const payload: RefreshTokenPayload = {
      sub: userId,
      tokenId,
      iat: now,
      exp: now + this.parseExpiresIn(this.config.refreshExpiresIn),
    };

    return jwt.sign(payload, this.config.secret, {
      algorithm: 'HS256',
    });
  }

  /**
   * Verify and decode an access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.config.secret, {
        algorithms: ['HS256'],
        issuer: this.config.issuer,
        audience: this.config.audience,
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError('Access token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new InvalidTokenError('Invalid access token');
      } else {
        throw new TokenVerificationError('Token verification failed');
      }
    }
  }

  /**
   * Verify and decode a refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, this.config.secret, {
        algorithms: ['HS256'],
      }) as RefreshTokenPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError('Refresh token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new InvalidTokenError('Invalid refresh token');
      } else {
        throw new TokenVerificationError('Token verification failed');
      }
    }
  }

  /**
   * Decode a token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    return jwt.decode(token);
  }

  /**
   * Check if a token is expired without verification
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      return true;
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return null;
      }
      
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }

  /**
   * Parse expires in string to seconds
   */
  private static parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiresIn format: ${expiresIn}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error(`Invalid time unit: ${unit}`);
    }
  }
}

// Custom JWT error classes
export class TokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

export class TokenVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenVerificationError';
  }
}