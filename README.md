# Project Management API

A complete backend API for project management built with Express.js, TypeScript, PostgreSQL, and Prisma. Features user authentication, JWT tokens, role-based access control, and comprehensive project management functionality.

## Features

- 🔐 **User Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (Superuser/Regular users)
  - Password hashing with bcrypt
  - User registration and login

- 📊 **Project Management**
  - CRUD operations for projects
  - Project status tracking (active, completed, on_hold, cancelled)
  - Project ownership and permissions
  - Search and filtering capabilities
  - Project statistics

- 🛡️ **Security Features**
  - Rate limiting
  - CORS protection
  - Helmet security headers
  - Input validation
  - SQL injection protection with Prisma

- 🏗️ **Architecture**
  - Layered architecture (Controller → Service → Model)
  - TypeScript for type safety
  - Prisma ORM for database operations
  - Express.js framework
  - PostgreSQL database

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/project_management_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `POST /api/users/refresh-token` - Refresh JWT token
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Projects

- `GET /api/projects` - Get all projects (authenticated)
- `GET /api/projects/:id` - Get project by ID (authenticated)
- `POST /api/projects` - Create new project (authenticated)
- `PUT /api/projects/:id` - Update project (authenticated)
- `DELETE /api/projects/:id` - Delete project (authenticated)
- `GET /api/projects/my/projects` - Get user's projects (authenticated)
- `GET /api/projects/my/stats` - Get user's project statistics (authenticated)
- `GET /api/projects/stats` - Get all project statistics (public)

### User Management (Superuser only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/superuser` - Create superuser

## Default Credentials

After running the seed script, you can use these default credentials:

- **Email**: admin@example.com
- **Password**: admin123

⚠️ **Remember to change these credentials in production!**

## Request/Response Examples

### User Registration
```bash
POST /api/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### User Login
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "is_superuser": false,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Project
```bash
POST /api/projects
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "My New Project",
  "description": "A sample project description",
  "status": "active",
  "budget": 5000.00,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure

```
src/
├── controllers/          # HTTP request handlers
│   ├── user.controller.ts
│   └── project.controller.ts
├── services/            # Business logic layer
│   ├── user.services.ts
│   └── project.services.ts
├── models/              # Data models and interfaces
│   ├── user.model.ts
│   └── project.model.ts
├── middlewares/         # Express middlewares
│   └── auth.middleware.ts
├── routes/              # Route definitions
│   ├── user.route.ts
│   └── project.route.ts
├── utils/               # Utility functions
└── app.ts              # Main application file
```

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password
- `first_name` - Required first name
- `middle_name` - Optional middle name
- `last_name` - Required last name
- `is_superuser` - Boolean flag for admin privileges
- `is_active` - Boolean flag for account status
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Projects Table
- `id` - Primary key
- `name` - Project name
- `description` - Optional description
- `status` - Project status (active, completed, on_hold, cancelled)
- `budget` - Optional budget amount
- `start_date` - Optional start date
- `end_date` - Optional end date
- `owner_id` - Foreign key to users table
- `is_active` - Boolean flag for soft delete
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Security Considerations

1. **Environment Variables**: Never commit sensitive information to version control
2. **JWT Secrets**: Use strong, unique secrets for JWT tokens
3. **Password Hashing**: Passwords are hashed using bcrypt with 12 rounds
4. **Rate Limiting**: API endpoints are rate-limited to prevent abuse
5. **CORS**: Configure CORS properly for your frontend domain
6. **Input Validation**: All inputs are validated before processing

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure proper CORS settings
4. Set up HTTPS
5. Use a production database
6. Configure proper logging
7. Set up monitoring and error tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 