# Kursownik Backend API

A comprehensive course management system built with NestJS, featuring user authentication, course enrollment, payment processing, and currency exchange functionality.

## 🚀 Features

- **User Management**: Registration, authentication, and role-based access control
- **Course Management**: Create and manage courses with chapters and lessons
- **User Progress Tracking**: Track user progress through courses and lessons
- **Premium Content**: Support for premium course content with subscription model
- **Payment Processing**: Handle payments with multi-currency support
- **Forex Integration**: Real-time currency exchange rates
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom token-based authentication with bcrypt
- **Validation**: Class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest for unit and e2e tests
- **Code Quality**: ESLint, Prettier, Husky

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend-wakacyjne-wyzwanie-2025-kursownik
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/kursownik?schema=public"
   PORT=5000
   EXPIRY_TIME_MS=3600000
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate deploy

   # Seed the database (optional)
   npx prisma db seed
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:5000/api
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

### Watch Mode

```bash
npm run test:watch
```

## 📊 Database Schema

The application uses the following main entities:

- **User**: User accounts with email authentication
- **Course**: Course information and metadata
- **Chapter**: Course chapters for organizing content
- **Lesson**: Individual lessons within chapters
- **UserCourses**: User enrollment and progress tracking
- **Payment**: Payment processing and transaction records
- **ForexRate**: Currency exchange rate data

## 🔐 Authentication

The API uses a custom token-based authentication system:

- Tokens are formatted as `token_timestamp:email`
- Include the token in the `Authorization` header as `Bearer <token>`
- Tokens have configurable expiry time (default: 1 hour)

## 🌐 CORS Configuration

The application is configured to accept requests from:

- `localhost` (any port)
- `localhost:5000-5599` (development servers)

## 📝 Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
npm run format:check
```

### Type Checking

```bash
npm run typecheck
```

### Pre-flight Checks

```bash
npm run preflight
```

## 🗂️ Project Structure

```
src/
├── auth/           # Authentication module
├── chapter/        # Chapter management
├── course/         # Course management
├── forex/          # Currency exchange functionality
├── lesson/         # Lesson management
├── prisma/         # Database service
├── user/           # User management
├── app.module.ts   # Main application module
└── main.ts         # Application entry point

prisma/
├── migrations/     # Database migrations
├── schema.prisma   # Database schema
└── seed.ts         # Database seeding

test/
├── e2e/           # End-to-end tests
└── jest-e2e.json  # E2E test configuration
```

## 🔄 Available Scripts

| Script                | Description                               |
| --------------------- | ----------------------------------------- |
| `npm run start`       | Start the application                     |
| `npm run start:dev`   | Start in development mode with hot reload |
| `npm run start:debug` | Start in debug mode                       |
| `npm run build`       | Build the application                     |
| `npm run test`        | Run unit tests                            |
| `npm run test:e2e`    | Run end-to-end tests                      |
| `npm run test:cov`    | Generate test coverage report             |
| `npm run lint`        | Run ESLint                                |
| `npm run format`      | Format code with Prettier                 |
| `npm run typecheck`   | Run TypeScript type checking              |
| `npm run preflight`   | Run all quality checks                    |
