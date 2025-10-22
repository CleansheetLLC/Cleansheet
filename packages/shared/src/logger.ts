import winston from 'winston';
import { Environment } from '@cleansheet/types';

export interface LoggerConfig {
  level: string;
  environment: Environment;
  serviceName: string;
  version: string;
}

export class Logger {
  private static instance: winston.Logger;
  private static config: LoggerConfig;

  static configure(config: LoggerConfig): void {
    this.config = config;
    
    const formats = [
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ];

    // Add colorization for development
    if (config.environment === 'development') {
      formats.unshift(winston.format.colorize());
      formats.push(winston.format.simple());
    }

    this.instance = winston.createLogger({
      level: config.level,
      format: winston.format.combine(...formats),
      defaultMeta: {
        service: config.serviceName,
        version: config.version,
        environment: config.environment,
      },
      transports: [
        new winston.transports.Console({
          handleExceptions: true,
          handleRejections: true,
        }),
      ],
    });

    // Add file transport for production
    if (config.environment === 'production') {
      this.instance.add(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        })
      );
      
      this.instance.add(
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        })
      );
    }
  }

  static getInstance(): winston.Logger {
    if (!this.instance) {
      throw new Error('Logger not configured. Call Logger.configure() first.');
    }
    return this.instance;
  }

  // Convenience methods
  static debug(message: string, meta?: any): void {
    this.getInstance().debug(message, meta);
  }

  static info(message: string, meta?: any): void {
    this.getInstance().info(message, meta);
  }

  static warn(message: string, meta?: any): void {
    this.getInstance().warn(message, meta);
  }

  static error(message: string, error?: Error | any, meta?: any): void {
    const logMeta = { ...meta };
    
    if (error instanceof Error) {
      logMeta.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      logMeta.error = error;
    }
    
    this.getInstance().error(message, logMeta);
  }

  // Structured logging methods
  static logAuthEvent(event: string, userId?: string, meta?: any): void {
    this.info(`Auth: ${event}`, {
      category: 'authentication',
      userId,
      ...meta,
    });
  }

  static logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any): void {
    const logMethod = severity === 'critical' || severity === 'high' ? this.error : this.warn;
    
    logMethod(`Security: ${event}`, {
      category: 'security',
      severity,
      ...meta,
    });
  }

  static logApiRequest(method: string, path: string, statusCode: number, responseTime: number, meta?: any): void {
    const level = statusCode >= 400 ? 'warn' : 'info';
    
    this.getInstance().log(level, `API: ${method} ${path}`, {
      category: 'api',
      method,
      path,
      statusCode,
      responseTime,
      ...meta,
    });
  }

  static logDatabaseQuery(query: string, duration: number, meta?: any): void {
    this.debug('Database query executed', {
      category: 'database',
      query: this.config.environment === 'production' ? '[REDACTED]' : query,
      duration,
      ...meta,
    });
  }

  static logExternalService(service: string, operation: string, success: boolean, responseTime?: number, meta?: any): void {
    const level = success ? 'info' : 'warn';
    
    this.getInstance().log(level, `External service: ${service} ${operation}`, {
      category: 'external_service',
      service,
      operation,
      success,
      responseTime,
      ...meta,
    });
  }

  // Performance logging
  static startTimer(label: string): () => void {
    const start = Date.now();
    
    return () => {
      const duration = Date.now() - start;
      this.debug(`Timer: ${label}`, {
        category: 'performance',
        label,
        duration,
      });
    };
  }

  // Audit logging
  static logAuditEvent(
    action: string,
    resourceType: string,
    resourceId?: string,
    userId?: string,
    organizationId?: string,
    meta?: any
  ): void {
    this.info(`Audit: ${action} ${resourceType}`, {
      category: 'audit',
      action,
      resourceType,
      resourceId,
      userId,
      organizationId,
      ...meta,
    });
  }
}