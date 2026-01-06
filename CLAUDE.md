# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Backend (Python/FastAPI)

```bash
cd backend

# Setup
python -m venv venv
source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt

# Run server
python -m app.main
# Or with uvicorn directly:
uvicorn app.main:app --reload --port 8000

# Database setup
psql -U postgres -d news_verifier -f ../init.sql

# Testing cache
python test_cache.py
```

### Frontend (React/TypeScript/Vite)

```bash
cd frontend

# Setup
npm install

# Development
npm run dev          # Start dev server (http://localhost:3000 or :5173)
npm run build        # Build for production (runs TypeScript compiler first)
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Architecture Overview

### Backend Architecture

**Framework**: FastAPI with async/await patterns throughout
**Database**: PostgreSQL with SQLAlchemy 2.0 (async)
**Cache**: Redis with graceful degradation (optional)

#### Key Design Patterns

1. **Service Layer Pattern**: Business logic separated into services (`app/services/`)
   - `LinkService`: Handles all link operations with cache integration
   - `UserService`: User authentication and management
   - `CacheService`: Redis caching with SHA256 request hashing
   - `scraper_service`: Article scraping and metadata extraction

2. **Dependency Injection**: FastAPI `Depends()` for database sessions, Redis clients, and user authentication

3. **Cache Strategy**:
   - Request hashing: Parameters (user_id, page, status, etc.) hashed with SHA256 to generate unique cache keys
   - Cache-first approach: Check Redis before database
   - Automatic invalidation: Cache cleared on data mutations (create/update/delete)
   - Debug flag: Every API response includes `from_cache` field
   - Graceful degradation: Application works perfectly without Redis

4. **Authentication**: Email-only auth (no passwords) via `X-User-Email` header
   - Header validated in `get_current_user_id()` dependency
   - Production apps should replace with JWT tokens

#### Database Models (app/models/)

- **User**: Email-based users with relationships to links
- **Link**: News article URLs with metadata (title, content, source_domain, author, published_at)
  - Status enum: pending → processing → scraped → verified → failed
  - Relationships: verification, chunks, queries
- **Verification**: AI verification results for links
- **LinkChunk**: Text chunks for RAG processing
- **LinkQuery**: User queries against link content

#### API Structure

Routes defined in `app/api/v1/endpoints/`:
- `auth.py`: Login and email validation
- `links.py`: Full CRUD + scraping + stats
- `dashboard.py`: Dashboard aggregated data

All responses use `APIResponse[T]` wrapper (defined in `schemas/common.py`) with:
- `success: bool`
- `message: str`
- `data: T`
- `from_cache: bool` (cache hit indicator)

#### Application Lifecycle (app/main.py)

Uses FastAPI lifespan context manager for startup/shutdown:
- Startup: Initialize database + Redis connection
- Shutdown: Close database + Redis gracefully

### Frontend Architecture

**Framework**: React 18 with TypeScript
**Build Tool**: Vite
**Routing**: React Router v6
**State Management**: Zustand (`context/authStore.ts`)
**Styling**: TailwindCSS
**HTTP Client**: Axios with interceptors

#### Key Patterns

1. **API Service Pattern** (`services/api.ts`):
   - Singleton `ApiService` class
   - Request interceptor: Adds `X-User-Email` header
   - Response interceptor: Handles 401 redirects
   - Email persisted to localStorage

2. **Protected Routes**: `ProtectedRoute` component checks authentication

3. **Component Structure**:
   - `components/auth/`: Login forms
   - `components/dashboard/`: Dashboard, stats cards, recent links
   - `components/links/`: Link list, detail view, add/edit forms
   - `components/common/`: Reusable components (spinners, protected routes)

## Important Notes

### Redis Caching Implementation

- Cache keys generated using `CacheService._generate_cache_key()` with SHA256 hashing
- TTL configured via `REDIS_TTL` env var (default: 300 seconds)
- Invalidation patterns in `CacheService.invalidate_link_cache()`:
  - On link create/update/delete: Invalidates all list queries for that user
  - On link-specific operations: Invalidates both list and detail caches

### Environment Configuration

Backend requires (`.env`):
- `DATABASE_URL`: PostgreSQL connection string (using psycopg driver)
- `REDIS_URL`: Redis connection (optional, defaults to localhost:6379)
- `REDIS_ENABLED`: Set to `false` to disable caching
- `CORS_ORIGINS`: List of allowed frontend origins

Frontend requires (`.env`):
- `VITE_API_URL`: Backend API URL (e.g., http://localhost:8000/api/v1)

### Database Migrations

Currently using direct SQL via `init.sql`. For schema changes:
1. Modify `init.sql` for new deployments
2. Consider adding Alembic migrations for existing deployments (alembic is in requirements.txt but not yet configured)

### Test Users

Pre-populated in `init.sql`:
- test@example.com
- demo@example.com
- student@university.edu
