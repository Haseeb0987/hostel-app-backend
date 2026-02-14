# Node.js Express Supabase Backend

A professional Node.js backend project using Express.js and Supabase for authentication. Perfect foundation for SaaS applications.

## 🏗️ Project Structure

```
src/
├── config/
│   └── supabase.js           # Supabase client configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── userController.js     # User management logic
├── middlewares/
│   ├── authMiddleware.js     # JWT verification middleware
│   ├── errorMiddleware.js    # Global error handling
│   └── validationMiddleware.js # Input validation
├── routes/
│   ├── authRoutes.js         # Authentication endpoints
│   └── userRoutes.js         # User management endpoints  
├── services/
│   ├── authService.js        # Authentication business logic
│   └── userService.js        # User business logic
├── app.js                    # Express app configuration
└── server.js                 # Server entry point

package.json                  # Dependencies and scripts
.env.example                  # Environment variables template
.gitignore                    # Git ignore rules
README.md                     # This documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Supabase account

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New project"
3. Choose your organization
4. Fill in project details:
   - **Name**: Your project name
   - **Database password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"
6. Wait for setup to complete (2-3 minutes)

### 3. Get Supabase Credentials

Once your project is ready:

1. Go to **Settings** → **API** in your Supabase dashboard
2. Find your credentials:

```
Project URL: https://your-project-id.supabase.co
Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   PORT=3000
   NODE_ENV=development
   
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   JWT_SECRET=your-optional-jwt-secret
   ```

### 5. Run the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on http://localhost:3000

## 📡 API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully. Please check your email for verification.",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "emailConfirmed": false,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token"
    }
  }
}
```

#### POST /api/auth/login
Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "emailConfirmed": true,
      "lastSignIn": "2024-01-01T00:00:00Z"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### POST /api/auth/logout
Logout user and invalidate session.

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST /api/auth/refresh
Refresh expired access token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

### User Endpoints (Protected)

All user endpoints require authentication header:
```
Authorization: Bearer jwt-token
```

#### GET /api/user/profile
Get current user's profile.

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "emailConfirmed": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "lastSignIn": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### PUT /api/user/profile
Update user profile.

#### DELETE /api/user/account
Delete user account.

#### POST /api/user/change-password
Change user password.

## 🔐 Authentication Flow

### How It Works

1. **User Registration**:
   - User provides email and password
   - Supabase creates account and sends verification email
   - User receives JWT tokens for immediate use

2. **User Login**:
   - User provides credentials
   - Supabase validates and returns JWT tokens
   - Access token used for API requests
   - Refresh token used to get new access tokens

3. **Protected Routes**:
   - Client sends access token in Authorization header
   - Middleware verifies token with Supabase
   - User data attached to request object
   - Route handler executes with authenticated context

4. **Token Refresh**:
   - When access token expires, use refresh token
   - Get new access token without re-login
   - Continue making authenticated requests

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 Testing with Postman

### 1. Create Postman Collection

Create a new collection called "Node Express Supabase API"

### 2. Set up Environment Variables

Create environment with variables:
- `baseUrl`: `http://localhost:3000`
- `accessToken`: (will be set automatically)

### 3. Test Authentication

#### Test Signup
```
POST {{baseUrl}}/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

#### Test Login
```
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123"
}
```

**Add to Tests tab to save token:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("accessToken", response.data.accessToken);
}
```

#### Test Protected Route
```
GET {{baseUrl}}/api/user/profile
Authorization: Bearer {{accessToken}}
```

### 4. Test Error Cases

- Invalid credentials
- Missing token
- Expired token
- Invalid email format
- Weak password

## 🏛️ Architecture Patterns

### Layered Architecture

1. **Routes Layer**: HTTP endpoint definitions
2. **Controller Layer**: Request/response handling
3. **Service Layer**: Business logic
4. **Config Layer**: External service configuration

### Key Features

- **Input Validation**: Joi schemas for request validation
- **Error Handling**: Centralized error middleware
- **Security**: Helmet, CORS, rate limiting
- **Authentication**: JWT token verification
- **Environment Configuration**: dotenv for settings

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `JWT_SECRET` | Additional JWT secret | No |

### Supabase Configuration

The Supabase client is configured with:
- Auto token refresh
- No session persistence (backend handles tokens)
- Error handling for connection issues

## 📈 Extending the Project

### Add New Routes

1. Create route file in `src/routes/`
2. Create controller in `src/controllers/`
3. Add business logic to `src/services/`
4. Register routes in `src/app.js`

### Add Database Tables

1. Go to Supabase Dashboard
2. Navigate to Database → Tables
3. Create tables with proper RLS policies
4. Update services to query new tables

### Add Middleware

1. Create middleware file in `src/middlewares/`
2. Export middleware functions
3. Apply to routes or globally in app.js

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin request handling
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Prevent malicious input
- **JWT Verification**: Secure route protection
- **Error Sanitization**: Prevent information leakage

## 🚀 Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use production Supabase project
3. Configure proper CORS origins
4. Set up SSL/HTTPS
5. Use process manager (PM2)

### Recommended Services

- **Hosting**: Railway, Render, Heroku
- **Database**: Supabase (PostgreSQL)
- **Monitoring**: Supabase Dashboard
- **Logging**: Built-in Morgan + external service

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📄 License

MIT License - feel free to use in your projects.

## 🆘 Support

For issues:
1. Check Supabase connection
2. Verify environment variables
3. Check server logs
4. Review API documentation

---

**Happy coding! 🎉**

This backend provides a solid foundation for any SaaS application requiring user authentication. Extend it based on your specific needs.