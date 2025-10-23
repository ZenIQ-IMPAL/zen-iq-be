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

# RecommendationService Overview

The `RecommendationService` provides course recommendations for a user based on their recent search history. It uses **TF-IDF vectorization** and **cosine similarity** to match the user’s past search queries with available courses, returning the top 3 most relevant courses. This is a **classic AI content-based recommendation system**, not a modern deep learning–based AI.

---

## Key Notes

### 1. Libraries & Tools
- `natural`: For TF-IDF computation (classic NLP).  
- `compute-cosine-similarity`: Measures similarity between vectors.  
- `drizzle-orm`: Database queries.  
- `CourseService`: Fetches courses from the database.  

### 2. Workflow
1. Retrieve the last N search queries of a user.  
2. Fetch all available courses.  
3. Build a TF-IDF vector for each course (title + description).  
4. Combine the user’s search queries into a single query vector.  
5. Compute **cosine similarity** between the query vector and each course vector.  
6. Sort courses by similarity score and return the top 3.  

### 3. Implementation Details
- **Vector padding**: Ensures query and course vectors are the same length.  
- **Score computation**: `score = cosineSimilarity(queryVector, courseVector)`.  
- Returns an array of `CourseWithInstructor` objects.  

### 4. AI Nature
- **It is AI**: Uses NLP and vector math to make recommendations.  
- **Not modern AI**: No deep learning, embeddings, or LLMs; purely TF-IDF + cosine similarity.  

### 5. Limitations
- Only uses course title + description (ignores other behaviors like clicks).  
- TF-IDF captures keyword overlap but not semantic meaning deeply.  
- Not optimized for very large datasets (computes similarity for all courses).  

### 6. Potential Upgrades
- Use **embedding-based semantic search** (e.g., OpenAI embeddings) for better context understanding.  
- Incorporate **user interactions** (enrollments, ratings) for collaborative filtering.  
- Optimize for **large datasets** using approximate nearest neighbor search.  

## Why it is AI

### Natural Language Processing (NLP)
- It processes text (course titles/descriptions and user searches) using **TF-IDF**, which is a standard NLP technique.  
- TF-IDF converts text into numerical vectors so the system can “understand” similarity between texts.  

### Reasoning / Decision Making
- The system computes **cosine similarity** between the user query vector and course vectors.  
- It ranks courses based on these scores. This is a form of **algorithmic reasoning**, which counts as AI.  

### Automated Recommendations
- Given user input, it automatically recommends courses — i.e., it makes decisions based on data.  

## Why it’s NOT modern AI
- No deep learning, no neural networks, no large language models (LLMs).  
- Doesn’t understand meaning at a high semantic level; it only works on **keyword overlap**.
