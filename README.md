# News Verifier Platform

A full-stack application for verifying news article credibility.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, React Query, Zustand |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic |
| **Database** | PostgreSQL |

## Features

- ✅ Email-only authentication (no password)
- ✅ User dashboard with statistics
- ✅ Full CRUD operations for links
- ✅ Article scraping and metadata extraction
- ✅ Responsive UI with modern design

## Project Structure

```
news-verifier/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/            # API endpoints
│   │   │   └── endpoints/
│   │   │       ├── auth.py    # Authentication
│   │   │       ├── links.py   # Link CRUD
│   │   │       └── dashboard.py
│   │   ├── core/              # Configuration
│   │   ├── db/                # Database
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── main.py            # App entry point
│   ├── requirements.txt
│   └── .env.example
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # State management
│   │   ├── services/          # API client
│   │   ├── types/             # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── .env.example
├── init.sql                    # Database initialization
└── README.md
```

## Prerequisites

- **PostgreSQL** (any recent version)
- **Python 3.10+**
- **Node.js 18+**

## Quick Start

### 1. Setup PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE news_verifier;
\q

# Run initialization script
psql -U postgres -d news_verifier -f init.sql
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the backend
uvicorn app.main:app --reload --port 8000
```

The API will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:3000

### 4. Test Login

Use one of the pre-created test users:
- `test@example.com`
- `demo@example.com`
- `student@university.edu`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login with email |
| POST | `/api/v1/auth/check-email` | Check if email exists |

### Links

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/links` | Get paginated links |
| POST | `/api/v1/links` | Create new link |
| GET | `/api/v1/links/{id}` | Get link details |
| PATCH | `/api/v1/links/{id}` | Update link |
| DELETE | `/api/v1/links/{id}` | Delete link |
| POST | `/api/v1/links/{id}/scrape` | Trigger link scraping |
| GET | `/api/v1/links/stats` | Get link statistics |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard` | Get dashboard data |

## Environment Variables

### Backend (.env)

```env
APP_NAME="News Verifier API"
DEBUG=true
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/news_verifier
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Get links
curl http://localhost:8000/api/v1/links \
  -H "X-User-Email: test@example.com"

# Create link
curl -X POST http://localhost:8000/api/v1/links \
  -H "Content-Type: application/json" \
  -H "X-User-Email: test@example.com" \
  -d '{"url": "https://example.com/article"}'
```

## Troubleshooting

### PostgreSQL Connection Error

Make sure PostgreSQL is running and the database exists:
```bash
psql -U postgres -c "\l"  # List databases
```

### Port Already in Use

```bash
# Backend on different port
uvicorn app.main:app --reload --port 8001

# Frontend on different port  
npm run dev -- --port 3001
```

## License

MIT License
