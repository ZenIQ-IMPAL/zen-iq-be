# Zen IQ Backend

Express.js REST API with TypeScript, Neon Postgres, Drizzle ORM, and JWT Authentication.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: Neon Postgres
- **ORM**: Drizzle ORM
- **Authentication**: JWT
- **Validation**: Zod
- **Logging**: Consola
- **Code Quality**: Biome
- **Development**: Nodemon + ts-node

## Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm 8.0 or higher
- Neon Database account

### Installation

```bash
# Clone repository
git clone <repository-url>
cd zen-iq-be

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

### Environment Configuration

Edit `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
```

### Database Setup

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### Development

```bash
# Start development server
npm run dev

# Server runs on http://localhost:3000
```

## Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema directly (development only)
npm run db:studio    # Open Drizzle Studio GUI
npm run db:seed      # Seed database with sample data
npm run lint         # Check code with Biome
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Biome
npm run type-check   # TypeScript type checking
npm run clean        # Clean build directory
```

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── database.ts      # Database connection
│   └── env.ts          # Environment validation
├── database/           # Database related files
│   ├── migrations/     # SQL migration files
│   ├── seeds/          # Database seeders
│   └── schema.ts       # Database schema definition
├── modules/            # Feature modules
│   └── auth/          # Authentication module
│       ├── controllers/
│       ├── services/
│       ├── middlewares/
│       ├── validators/
│       └── routes/
├── shared/            # Shared utilities
│   ├── middleware/    # Global middleware
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── app.ts            # Express app configuration
└── server.ts         # Server entry point
```

## Development Guidelines

### Code Style

- Use Biome for formatting and linting
- Follow functional programming patterns
- Avoid nested if-else statements
- Use early returns and switch statements
- Prefer composition over inheritance

## Authentication

API uses JWT (JSON Web Token) for authentication. Include token in Authorization header:

```http
Authorization: Bearer your-jwt-token-here
```