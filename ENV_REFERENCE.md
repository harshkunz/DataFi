## Reference

## Backend Environment Variables

Location: `backend/.env`

### Server Configuration

#### `PORT`
- **Type**: Number
- **Default**: `7000`
- **Description**: The port on which the Express server runs
- **Example**: `PORT=7000`

#### `NODE_ENV`
- **Type**: String
- **Default**: `development`
- **Options**: `development`, `production`, `test`
- **Description**: Determines runtime behavior and logging level
- **Example**: `NODE_ENV=development`

### Database Configuration

#### `DATABASE_URL`
- **Type**: String (PostgreSQL connection string)
- **Required**: Yes
- **Description**: Connection string for PostgreSQL database with Prisma
- **Format**: `postgresql://username:password@host:port/database?schema=public`
- **Example**: `postgresql://postgres:postgres@localhost:5432/datafi?schema=public`
- **Note**: Must include `?schema=public` for Prisma

#### `DIRECT_URL`
- **Type**: String (PostgreSQL connection string)
- **Required**: Yes
- **Description**: Direct connection URL for migrations and introspection
- **Format**: Same as `DATABASE_URL`
- **Example**: `postgresql://postgres:postgres@localhost:5432/datafi?schema=public`
- **Note**: Used by Prisma CLI for migrations

### Authentication

#### `ACCESS_SECRET`
- **Type**: String
- **Required**: Yes
- **Min Length**: 32 characters recommended
- **Description**: Secret key for signing JWT access tokens (expires in ~1 hour)
- **Example**: `your_super_secret_access_key_at_least_32_characters_long_for_security_123456`
- **Note**: Change this for every environment. Use strong random strings in production.

#### `REFRESH_SECRET`
- **Type**: String
- **Required**: Yes
- **Min Length**: 32 characters recommended
- **Description**: Secret key for signing JWT refresh tokens (expires in ~7 days)
- **Example**: `your_super_secret_refresh_key_at_least_32_characters_long_for_security_789012`
- **Note**: Change this for every environment. Use strong random strings in production.

### Frontend Configuration

#### `FRONTEND_URL`
- **Type**: String (URL)
- **Default**: `http://localhost:3000`
- **Description**: Frontend application URL for CORS configuration
- **Example**: 
  - Development: `http://localhost:3000`
  - Production: `https://datafi.com`
- **Note**: CORS requests will only be accepted from this origin

### API Documentation

#### `SWAGGER_ENABLED`
- **Type**: Boolean (String)
- **Default**: `true`
- **Description**: Enable/disable Swagger API documentation
- **Example**: `SWAGGER_ENABLED=true`
- **Access**: `http://localhost:7000/api-docs` when enabled

#### `SWAGGER_PORT`
- **Type**: Number
- **Default**: Same as `PORT`
- **Description**: Port for Swagger UI (usually same as server port)
- **Example**: `SWAGGER_PORT=7000`


## Frontend Environment Variables

Location: `frontend/.env.local`

### API Configuration

#### `NEXT_PUBLIC_API_URL`
- **Type**: String (URL)
- **Required**: Yes
- **Description**: Backend API base URL for all HTTP requests
- **Example**:
  - Development: `http://localhost:7000/api`
  - Production: `https://api.datafi.com/api`
- **Note**: Must include `/api` path suffix

### Application Settings

#### `NEXT_PUBLIC_APP_NAME`
- **Type**: String
- **Default**: `DataFi`
- **Description**: Application name used in headers and metadata
- **Example**: `NEXT_PUBLIC_APP_NAME=DataFi`
- **Note**: Visible to users in UI

### Development/Debug Settings

#### `NEXT_PUBLIC_DEBUG`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Enable debug logging in browser console
- **Example**: `NEXT_PUBLIC_DEBUG=true`
- **Note**: Only enable during development


## Environment Setup Guide

### Development Environment

#### Backend `.env`
```env
PORT=7000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/datafi?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/datafi?schema=public"

ACCESS_SECRET=dev_access_secret_key_minimum_32_chars_long_1234567890
REFRESH_SECRET=dev_refresh_secret_key_minimum_32_chars_long_1234567890

FRONTEND_URL="http://localhost:3000"

SWAGGER_ENABLED=true
SWAGGER_PORT=7000
```

#### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:7000/api
NEXT_PUBLIC_APP_NAME=DataFi
NEXT_PUBLIC_DEBUG=true
```

### Production Environment

#### Backend `.env`
```env
PORT=3000
NODE_ENV=production

DATABASE_URL="postgresql://user:password@prod-db.example.com:5432/datafi?schema=public"
DIRECT_URL="postgresql://user:password@prod-db.example.com:5432/datafi?schema=public"

ACCESS_SECRET=<strong_random_string_32+_chars>
REFRESH_SECRET=<strong_random_string_32+_chars>

FRONTEND_URL="https://datafi.com"

SWAGGER_ENABLED=false
SWAGGER_PORT=3000
```

#### Frontend `.env.local` (Build time variables)
```env
NEXT_PUBLIC_API_URL=https://api.datafi.com/api
NEXT_PUBLIC_APP_NAME=DataFi
NEXT_PUBLIC_DEBUG=false
```

## Generating Secret Keys

### Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Using OpenSSL
```bash
openssl rand -hex 32
```

### Using Python
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```


## Environment Variables by Feature

### Authentication & Security
- `ACCESS_SECRET` - Access token signing
- `REFRESH_SECRET` - Refresh token signing
- `FRONTEND_URL` - CORS origin

### Database Connection
- `DATABASE_URL` - Prisma ORM connection
- `DIRECT_URL` - Prisma CLI migrations
- `NODE_ENV` - Affects connection pooling

### API & Server
- `PORT` - Server port
- `NODE_ENV` - Server behavior
- `NEXT_PUBLIC_API_URL` - API endpoint

### Documentation
- `SWAGGER_ENABLED` - Enable API docs
- `SWAGGER_PORT` - API docs port


## Troubleshooting

### "TypeError: Cannot read property 'DATABASE_URL' of undefined"
**Cause**: `.env` file not loaded
**Solution**: 
```bash
# Ensure .env file exists in backend root
ls -la backend/.env

# Or copy from example
cp backend/.env.example backend/.env
```

### "CORS policy: Origin not allowed"
**Cause**: `FRONTEND_URL` doesn't match request origin
**Solution**:
```bash
# In backend/.env, update FRONTEND_URL
# Frontend at: http://localhost:3000
FRONTEND_URL="http://localhost:3000"
```

### "Invalid connection string"
**Cause**: Malformed `DATABASE_URL`
**Solution**: Verify format
```
postgresql://user:password@host:port/database?schema=public
                                              ^^^^^^^^^^^^^^
                                       This part is required
```

### "JWT token expired immediately"
**Cause**: Empty `ACCESS_SECRET` or `REFRESH_SECRET`
**Solution**:
```bash
# Generate new secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
ACCESS_SECRET=<generated_string>
REFRESH_SECRET=<generated_string>
```

## Security Best Practices

1. **Never commit `.env` files** to version control
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Use strong secrets** in production
   - Minimum 32 characters
   - Mix uppercase, lowercase, numbers, special characters
   - Use cryptographically secure random generation

3. **Rotate secrets regularly**
   - Change `ACCESS_SECRET` and `REFRESH_SECRET` periodically
   - Implement secret rotation strategy

4. **Environment-specific values**
   - Never use development values in production
   - Never use production values in development

5. **Protect sensitive data**
   - Database credentials should be restricted
   - API keys should be rotated regularly
   - Use environment-specific databases

### Quick Reference Table

| Variable | Backend | Frontend | Required | Default |
|----------|---------|----------|----------|---------|
| PORT | ✓ | ✗ | ✓ | 7000 |
| NODE_ENV | ✓ | ✗ | ✓ | development |
| DATABASE_URL | ✓ | ✗ | ✓ | - |
| DIRECT_URL | ✓ | ✗ | ✓ | - |
| ACCESS_SECRET | ✓ | ✗ | ✓ | - |
| REFRESH_SECRET | ✓ | ✗ | ✓ | - |
| FRONTEND_URL | ✓ | ✗ | ✗ | http://localhost:3000 |
| SWAGGER_ENABLED | ✓ | ✗ | ✗ | true |
| NEXT_PUBLIC_API_URL | ✗ | ✓ | ✓ | - |
| NEXT_PUBLIC_APP_NAME | ✗ | ✓ | ✗ | DataFi |
| NEXT_PUBLIC_DEBUG | ✗ | ✓ | ✗ | false |
