# Cleansheet Platform

A comprehensive multi-tenant career development and professional tools platform.

## Project Structure

This is a monorepo containing multiple services and shared packages:

```
cleansheet-platform/
├── packages/                 # Shared packages
│   ├── types/               # TypeScript type definitions
│   └── shared/              # Shared utilities and helpers
├── services/                # Microservices
│   ├── auth-service/        # Authentication and authorization service
│   ├── api-gateway/         # API gateway and routing
│   └── ...                  # Additional services
├── scripts/                 # Database and deployment scripts
└── docker-compose.yml       # Development environment
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose
- PostgreSQL, Redis, MongoDB, and InfluxDB (via Docker)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cleansheet-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development databases**
   ```bash
   npm run docker:up
   ```

4. **Build shared packages**
   ```bash
   npm run build
   ```

5. **Start development services**
   ```bash
   npm run dev
   ```

### Database Setup

The development environment includes:

- **PostgreSQL** (port 5432): User data, roles, and financial transactions
- **Redis** (port 6379): Session storage and caching
- **MongoDB** (port 27017): Configuration and profile data
- **InfluxDB** (port 8086): Metrics and analytics data

Default credentials are configured for development in `docker-compose.yml`.

## Architecture

### Microservices Architecture

The platform follows a microservices architecture with:

- **API Gateway**: Request routing, authentication, and rate limiting
- **Authentication Service**: User authentication, authorization, and session management
- **Profile Service**: User profile management and LinkedIn integration
- **Analytics Service**: Career analytics and insights (future)
- **Platform Admin Service**: Multi-tenant platform management (future)

### Shared Packages

- **@cleansheet/types**: TypeScript interfaces and type definitions
- **@cleansheet/shared**: Common utilities, validation, crypto, JWT, logging, and error handling

## Development

### Available Scripts

- `npm run build`: Build all packages and services
- `npm run test`: Run tests across all packages
- `npm run lint`: Lint TypeScript code
- `npm run dev`: Start development environment
- `npm run docker:up`: Start development databases
- `npm run docker:down`: Stop development databases

### Code Standards

- TypeScript with strict mode enabled
- ESLint for code linting
- Joi for input validation
- Winston for structured logging
- Jest for testing

### Environment Variables

Each service uses environment variables for configuration. See individual service README files for specific requirements.

## Security

- JWT tokens with RS256 signing
- bcrypt for password hashing
- Rate limiting on all endpoints
- Input validation and sanitization
- Audit logging for all operations
- Multi-factor authentication support

## Testing

- Unit tests with Jest
- Integration tests for API endpoints
- End-to-end tests for complete workflows
- Security testing for authentication flows

## Deployment

The platform is designed for containerized deployment with:

- Docker containers for each service
- Kubernetes manifests for orchestration
- Environment-specific configuration
- Health checks and monitoring

## Contributing

1. Follow the established code style and patterns
2. Write tests for new functionality
3. Update documentation as needed
4. Use conventional commit messages

## License

[License information]