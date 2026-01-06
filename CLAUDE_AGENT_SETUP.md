# Claude Code Agent Setup Documentation

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Claude Code Configuration](#claude-code-configuration)
5. [MCP Servers Setup](#mcp-servers-setup)
6. [Custom Agents](#custom-agents)
7. [Custom Skills](#custom-skills)
8. [Application Setup](#application-setup)
9. [Common Workflows](#common-workflows)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This project is configured to work with **Claude Code**, an AI-powered development assistant that helps with:
- Full-stack development (React/TypeScript frontend + Python/FastAPI backend)
- UI/UX component design and review
- Database operations and caching optimization
- Testing and documentation
- Code generation and refactoring

### Tech Stack
| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Zustand |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0 (async) |
| **Database** | PostgreSQL |
| **Cache** | Redis (optional) |
| **AI Assistant** | Claude Code with MCP servers |

---

## Prerequisites

### Required Software

#### 1. Core Development Tools
- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL** (any recent version) - [Download](https://www.postgresql.org/download/)
- **Claude Code CLI** - [Installation Guide](https://claude.com/claude-code)

#### 2. Optional (Highly Recommended)
- **Redis 5+** - For caching (10-30x performance boost)
  ```bash
  # macOS
  brew install redis
  brew services start redis

  # Ubuntu/Debian
  sudo apt install redis-server
  sudo systemctl start redis

  # Docker
  docker run -d --name redis -p 6379:6379 redis:latest
  ```

#### 3. Text Editor/IDE
- VS Code (recommended) or any editor with TypeScript support
- Optional: VS Code Claude Code extension for enhanced integration

---

## Project Setup

### 1. Clone and Navigate to Project
```bash
cd /path/to/ai-news
```

### 2. Database Initialization

```bash
# Create PostgreSQL database
psql -U postgres

# Inside psql:
CREATE DATABASE news_verifier;
\q

# Run initialization script
psql -U postgres -d news_verifier -f init.sql
```

This creates:
- Database schema (users, links, verifications, etc.)
- Test users: `test@example.com`, `demo@example.com`, `student@university.edu`

### 3. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings (see configuration section below)

# Start backend server
python -m app.main
# Or with uvicorn:
uvicorn app.main:app --reload --port 8000
```

**Backend Environment Variables** (`.env`):
```env
# Application
APP_NAME="News Verifier API"
DEBUG=true

# Database
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/news_verifier

# Redis (optional)
REDIS_URL=redis://localhost:6379
REDIS_TTL=300
REDIS_ENABLED=true

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# Scraping
SCRAPER_TIMEOUT=30
SCRAPER_USER_AGENT=NewsVerifier/1.0
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
```

**Frontend Environment Variables** (`.env`):
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### 5. Verify Application is Running

- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000 or http://localhost:5173
- **Test Login**: Use `test@example.com`

---

## Claude Code Configuration

### Configuration Files

Claude Code uses several configuration files in the project:

```
ai-news/
├── .claude/                          # Claude Code configuration directory
│   ├── settings.local.json          # Permissions and MCP settings
│   ├── agents/                      # Custom agent definitions
│   │   └── ui-ux-reviewer.md       # UI/UX review agent
│   └── skills/                      # Custom skills
│       └── build-ui-component/      # Component generator skill
├── .mcp.json                        # MCP servers configuration
└── CLAUDE.md                        # Project-specific instructions
```

### 1. Settings Configuration

The `.claude/settings.local.json` file configures:

```json
{
  "permissions": {
    "allow": [
      "Bash(find:*)",
      "Bash(curl:*)",
      "Bash(npm run dev:*)",
      "Bash(cat:*)",
      "Bash(claude mcp add:*)",
      "mcp__context7__resolve-library-id",
      "mcp__context7__get-library-docs",
      "mcp__playwright__browser_navigate",
      "mcp__playwright__browser_snapshot",
      "mcp__playwright__browser_take_screenshot",
      "mcp__playwright__browser_resize",
      "mcp__playwright__browser_click",
      "mcp__playwright__browser_press_key",
      "mcp__playwright__browser_close",
      "mcp__playwright__browser_hover",
      "mcp__playwright__browser_run_code",
      "Bash(pkill:*)",
      "Bash(chmod:*)"
    ]
  },
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["context7"]
}
```

**What these permissions enable:**
- File system operations (find, cat)
- HTTP requests (curl)
- Development server management (npm run dev)
- Browser automation via Playwright
- Documentation lookup via Context7
- MCP server management

### 2. Project Instructions (CLAUDE.md)

The `CLAUDE.md` file provides Claude Code with:
- Common commands for backend and frontend
- Architecture overview and design patterns
- API structure and endpoints
- Environment configuration requirements
- Testing procedures

Claude Code automatically reads this file to understand your project structure.

---

## MCP Servers Setup

MCP (Model Context Protocol) servers extend Claude Code's capabilities with specialized tools.

### Configured MCP Servers

#### 1. Context7 - Documentation Lookup
**Purpose**: Fetch up-to-date documentation for any library or framework

**Configuration** (`.mcp.json`):
```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp",
        "--api-key",
        "ctx7sk-eb8cebe4-58cb-4d2d-87eb-3322d6056976"
      ],
      "env": {}
    }
  }
}
```

**Usage Examples:**
```
"How do I implement authentication with FastAPI?"
"Show me the latest React Query documentation for mutations"
"What's the best way to handle async operations in SQLAlchemy 2.0?"
```

**Setup Command:**
```bash
claude mcp add context7 --scope project -- \
  npx -y @upstash/context7-mcp \
  --api-key ctx7sk-eb8cebe4-58cb-4d2d-87eb-3322d6056976
```

#### 2. Playwright MCP - Browser Automation
**Purpose**: Open browsers, navigate websites, take screenshots, test UI components

**Configuration** (`.mcp.json`):
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {}
    }
  }
}
```

**Usage Examples:**
```
"Open http://localhost:3000 and take a screenshot of the dashboard"
"Navigate to the login page and verify the form elements are visible"
"Test the modal component at different screen sizes"
```

**Setup Command:**
```bash
claude mcp add playwright --scope project npx @playwright/mcp@latest
```

**First-time Setup:**
```bash
# Install Playwright browsers
npx playwright install
```

### Verifying MCP Servers

To verify MCP servers are working:

1. **Check Configuration:**
   ```bash
   cat .mcp.json
   ```

2. **Test Context7:**
   Ask Claude Code: "Can you look up the FastAPI documentation for dependency injection?"

3. **Test Playwright:**
   Ask Claude Code: "Open http://localhost:3000 and take a screenshot"

---

## Custom Agents

Custom agents are specialized AI assistants for specific tasks.

### UI/UX Reviewer Agent

**Location:** `.claude/agents/ui-ux-reviewer.md`

**Purpose:** Expert feedback on React component design, user experience, and accessibility

**Capabilities:**
- Visual design analysis (layout, typography, colors, spacing)
- User experience evaluation (cognitive load, user flows, feedback mechanisms)
- Accessibility audits (WCAG 2.1 compliance, keyboard navigation, screen readers)
- Takes screenshots using Playwright MCP
- Provides actionable recommendations with code examples

**When to Use:**
- After implementing new UI components
- Before deploying features with user interfaces
- When reviewing form designs or interactive elements
- For accessibility compliance checks

**Example Prompts:**
```
"Review the DashboardStats component for UI/UX issues"
"I just created a new LoginForm - can you evaluate its accessibility?"
"Take a screenshot of the link management page and provide UX feedback"
```

**How It Works:**
1. Uses Playwright MCP to navigate to component in browser
2. Takes screenshots at multiple viewport sizes (mobile, tablet, desktop)
3. Tests interactions (hover, focus, error states)
4. Analyzes visual design, UX, and accessibility
5. Provides structured feedback with priorities

**Review Structure:**
- 🎨 **Visual Design**: Layout, spacing, typography, colors
- 👤 **User Experience**: User flows, feedback, affordances
- ♿ **Accessibility**: WCAG compliance, keyboard navigation, screen readers
- ✅ **Strengths**: What's working well
- 🔧 **Actionable Recommendations**: Prioritized improvements with code examples

**Configuration Highlights:**
```yaml
name: ui-ux-reviewer
model: sonnet
color: cyan
```

---

## Custom Skills

Skills are reusable commands that automate common development tasks.

### build-ui-component Skill

**Location:** `.claude/skills/build-ui-component/`

**Purpose:** Generate production-ready React components with TypeScript and TailwindCSS

**Usage Syntax:**
```
build-ui-component <ComponentName> "<description>"
```

**Examples:**

1. **Create a Button Component:**
   ```
   build-ui-component Button "reusable button with primary, secondary, and danger variants"
   ```

   Generates:
   - Multiple variants (primary, secondary, danger)
   - Different sizes (sm, md, lg)
   - Loading and disabled states
   - Full accessibility support (ARIA labels)
   - TypeScript interfaces
   - Usage examples

2. **Create a Modal Dialog:**
   ```
   build-ui-component Modal "modal dialog with backdrop, close button, and keyboard support"
   ```

   Generates:
   - Backdrop overlay with click-to-close
   - Close button with icon
   - Keyboard support (Escape key)
   - Focus management
   - Portal rendering (if needed)

3. **Create a Search Input:**
   ```
   build-ui-component SearchInput "search input with icon, real-time filtering, and clear button"
   ```

   Generates:
   - Icon placement (left/right)
   - Value and onChange handlers
   - Clear button functionality
   - Debounced input (optional)
   - Error state handling

4. **Create a User Card:**
   ```
   build-ui-component UserCard "card displaying user info with avatar, name, and action buttons"
   ```

   Generates:
   - Avatar image with fallback
   - User information fields
   - Action buttons with callbacks
   - Hover states

**What Gets Generated:**

1. **Component File:** `frontend/src/components/{category}/{ComponentName}.tsx`
2. **TypeScript Types:** Full type safety with interfaces
3. **TailwindCSS Styling:** Responsive, accessible styles
4. **Documentation:** JSDoc comments and prop descriptions
5. **Usage Examples:** 3+ code examples
6. **Accessibility:** ARIA labels, keyboard navigation, screen reader support

**Component Categories:**

Components are automatically categorized:
- `common/` - Reusable UI (Button, Input, Card, Modal)
- `auth/` - Authentication (LoginForm, RegisterForm)
- `dashboard/` - Dashboard-specific (StatsCard, Chart)
- `links/` - Link management (LinkList, LinkDetail, LinkForm)
- `layout/` - Layout components (NavBar, Sidebar, Footer)

**Best Practices Applied:**

✅ **TypeScript**
- Full type safety with interfaces
- No `any` types
- Proper prop typing
- Generic components where appropriate

✅ **Accessibility**
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Touch-friendly targets (44x44px minimum)

✅ **Responsive Design**
- Mobile-first approach
- Tailwind responsive classes
- Flexible layouts

✅ **Documentation**
- JSDoc comments
- Prop descriptions
- Usage examples
- Integration notes

**Tips for Better Results:**

1. **Be Specific:**
   - ❌ `build-ui-component Card "a card"`
   - ✅ `build-ui-component Card "content card with title, description, and optional footer"`

2. **Mention Key Features:**
   - ❌ `build-ui-component Input "input field"`
   - ✅ `build-ui-component Input "text input with label, validation, and error messages"`

3. **Include States or Variants:**
   - ❌ `build-ui-component Button "button"`
   - ✅ `build-ui-component Button "button with loading, disabled, and hover states"`

4. **Specify Behavior:**
   - ❌ `build-ui-component Dropdown "dropdown"`
   - ✅ `build-ui-component Dropdown "dropdown menu with keyboard navigation and search filtering"`

---

## Application Setup

### Development Workflow

#### 1. Start Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m app.main
```

**Verify Backend:**
- API running: http://localhost:8000
- Swagger docs: http://localhost:8000/docs
- Health check: `curl http://localhost:8000/api/v1/health`

#### 2. Start Frontend
```bash
cd frontend
npm run dev
```

**Verify Frontend:**
- App running: http://localhost:3000 or http://localhost:5173
- Test login with `test@example.com`

#### 3. Start Redis (Optional)
```bash
# macOS
brew services start redis

# Docker
docker start redis

# Verify
redis-cli ping  # Should return: PONG
```

**Redis Benefits:**
- 10-30x faster API responses
- Automatic cache invalidation
- Every API response includes `from_cache` flag for debugging

**Running Without Redis:**
The application works perfectly without Redis! Just set:
```env
REDIS_ENABLED=false
```

### Testing the Setup

#### Backend Tests
```bash
cd backend

# Test cache functionality
python test_cache.py

# Run pytest suite
pytest

# Test specific endpoint
curl http://localhost:8000/api/v1/links \
  -H "X-User-Email: test@example.com"
```

#### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

---

## Common Workflows

### Working with Claude Code

#### 1. Starting a Conversation
```bash
# Navigate to project
cd /Users/becir/Documents/IBU/ai-news

# Start Claude Code
claude
```

Claude Code will:
- Read `CLAUDE.md` for project context
- Load MCP servers (Context7, Playwright)
- Enable custom agents and skills

#### 2. Building UI Components

**Example 1: Create a New Component**
```
You: "Create a notification toast component with success, error, and warning variants"

Claude: I'll use the build-ui-component skill...
[Generates component with full implementation]
```

**Example 2: Review Component UI/UX**
```
You: "Review the DashboardStats component"

Claude: I'll use the ui-ux-reviewer agent to analyze the component...
[Opens browser, takes screenshots, provides detailed feedback]
```

#### 3. Backend Development

**Example: Add a New API Endpoint**
```
You: "Add an endpoint to export links as CSV"

Claude: Let me check the existing link endpoints first...
[Reads existing code]

I'll add the CSV export endpoint following your existing patterns:
1. Add route in app/api/v1/endpoints/links.py
2. Add service method in app/services/link_service.py
3. Add CSV generation utility
4. Include caching
[Implements solution]
```

#### 4. Database Operations

**Example: Add a New Model Field**
```
You: "Add a 'featured' boolean field to the Link model"

Claude: I'll:
1. Update the Link model in app/models/link.py
2. Update the link schema in app/schemas/link.py
3. Create an Alembic migration
4. Update relevant service methods
[Implements changes]
```

#### 5. Frontend Features

**Example: Add Search Functionality**
```
You: "Add a search bar to filter links by title in the dashboard"

Claude: I'll:
1. Create a SearchInput component using the build-ui-component skill
2. Add search state to the links page
3. Update the API call to include search parameter
4. Add debouncing for better UX
[Implements feature]
```

#### 6. Looking Up Documentation

**Example: Using Context7**
```
You: "How do I implement rate limiting in FastAPI?"

Claude: Let me look up the latest FastAPI documentation...
[Uses Context7 MCP to fetch docs]
[Provides implementation with code examples]
```

#### 7. Testing and Debugging

**Example: Debug a Component**
```
You: "The login form isn't submitting. Can you debug it?"

Claude: Let me:
1. Open the app in browser using Playwright
2. Navigate to the login page
3. Take screenshots to see the current state
4. Check the form submission code
5. Review network requests
[Diagnoses and fixes issue]
```

### Common Commands

```bash
# Backend
cd backend
source venv/bin/activate
python -m app.main                    # Start server
python test_cache.py                  # Test Redis cache
pytest                                # Run tests
uvicorn app.main:app --reload         # Alternative start

# Frontend
cd frontend
npm run dev                           # Start dev server
npm run build                         # Production build
npm run test                          # Run tests
npm run lint                          # Check code quality

# Database
psql -U postgres -d news_verifier     # Connect to DB
psql -U postgres -d news_verifier -f init.sql  # Reset DB

# Redis
redis-cli ping                        # Check Redis
redis-cli FLUSHALL                    # Clear cache
brew services restart redis           # Restart Redis (macOS)

# Git
git status                            # Check status
git add .                             # Stage changes
git commit -m "message"               # Commit
git push                              # Push to remote
```

---

## Troubleshooting

### Claude Code Issues

#### 1. MCP Servers Not Working

**Problem:** Context7 or Playwright commands fail

**Solution:**
```bash
# Check MCP configuration
cat .mcp.json

# Reinstall MCP servers
claude mcp add context7 --scope project -- \
  npx -y @upstash/context7-mcp --api-key YOUR_KEY

claude mcp add playwright --scope project npx @playwright/mcp@latest

# Install Playwright browsers
npx playwright install

# Restart Claude Code
```

#### 2. Permission Errors

**Problem:** "Permission denied" errors for certain operations

**Solution:**
Edit `.claude/settings.local.json` and add the required permission:
```json
{
  "permissions": {
    "allow": [
      "Bash(your-command:*)"
    ]
  }
}
```

#### 3. Custom Agents Not Available

**Problem:** UI/UX reviewer agent doesn't appear

**Solution:**
1. Check `.claude/agents/ui-ux-reviewer.md` exists
2. Verify YAML front matter is correct
3. Restart Claude Code
4. Try explicitly: "Use the ui-ux-reviewer agent to review this component"

#### 4. Skills Not Working

**Problem:** `build-ui-component` skill not found

**Solution:**
1. Check `.claude/skills/build-ui-component/` directory exists
2. Verify SKILL.md file is present
3. Restart Claude Code
4. Try full path: `/build-ui-component ComponentName "description"`

### Application Issues

#### 1. Backend Won't Start

**Problem:** `ModuleNotFoundError` or import errors

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt --upgrade
python -m app.main
```

**Problem:** Database connection error

**Solution:**
```bash
# Check PostgreSQL is running
psql -U postgres -c "\l"

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS news_verifier;"
psql -U postgres -c "CREATE DATABASE news_verifier;"
psql -U postgres -d news_verifier -f init.sql
```

**Problem:** Redis connection error (but app should still work)

**Solution:**
```bash
# Check Redis status
redis-cli ping

# Start Redis
brew services start redis  # macOS
sudo systemctl start redis  # Linux

# Or disable Redis in .env
echo "REDIS_ENABLED=false" >> .env
```

#### 2. Frontend Won't Start

**Problem:** `Module not found` errors

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Check TypeScript version
npm list typescript

# Rebuild
npm run build
```

**Problem:** Port already in use

**Solution:**
```bash
# Use different port
npm run dev -- --port 3001

# Or kill process using port
lsof -ti:3000 | xargs kill
```

#### 3. Authentication Issues

**Problem:** "User not found" error on login

**Solution:**
```bash
# Verify test users exist
psql -U postgres -d news_verifier -c "SELECT email FROM users;"

# If empty, reinitialize database
psql -U postgres -d news_verifier -f init.sql
```

**Problem:** CORS errors in browser console

**Solution:**
Check backend `.env`:
```env
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

Restart backend after changes.

#### 4. Cache Not Working

**Problem:** `from_cache` always returns `false`

**Solution:**
```bash
# Test Redis connection
redis-cli ping

# Check backend logs for Redis initialization
# Should see: "Redis cache initialized ✅"

# Test cache manually
cd backend
python test_cache.py

# Clear cache and retry
redis-cli FLUSHALL
```

**Problem:** Stale cache data

**Solution:**
```bash
# Clear all cache
redis-cli FLUSHALL

# Clear specific keys
redis-cli KEYS "link:*" | xargs redis-cli DEL
```

### Performance Issues

#### 1. Slow API Responses

**Check:**
1. Is Redis running? (`redis-cli ping`)
2. Check `from_cache` flag in API responses
3. Review database query performance in logs
4. Check PostgreSQL connection pool settings

**Solution:**
```bash
# Enable Redis if disabled
echo "REDIS_ENABLED=true" >> backend/.env

# Restart backend
cd backend
python -m app.main
```

#### 2. Frontend Build Slow

**Solution:**
```bash
# Clear cache
cd frontend
rm -rf node_modules/.vite

# Rebuild
npm run build
```

---

## Additional Resources

### Documentation Links

- **Claude Code**: https://claude.com/claude-code
- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **TailwindCSS**: https://tailwindcss.com/
- **SQLAlchemy 2.0**: https://docs.sqlalchemy.org/
- **Vite**: https://vitejs.dev/
- **Context7 MCP**: https://context7.com/
- **Playwright MCP**: https://github.com/microsoft/playwright-mcp

### Project Files Reference

```
ai-news/
├── .claude/                      # Claude Code configuration
│   ├── settings.local.json      # Permissions & MCP settings
│   ├── agents/                  # Custom agents
│   │   └── ui-ux-reviewer.md
│   └── skills/                  # Custom skills
│       └── build-ui-component/
├── .mcp.json                    # MCP servers config
├── CLAUDE.md                    # Project instructions for Claude
├── README.md                    # Application documentation
├── init.sql                     # Database initialization
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── api/v1/endpoints/   # API routes
│   │   ├── core/               # Configuration
│   │   ├── db/                 # Database & Redis
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic
│   │   └── main.py             # App entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example
│   └── test_cache.py           # Cache testing
└── frontend/                    # React frontend
    ├── src/
    │   ├── components/         # React components
    │   ├── context/            # Zustand stores
    │   ├── services/           # API client
    │   ├── types/              # TypeScript types
    │   └── App.tsx
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.ts
    └── .env.example
```

### Getting Help

1. **Claude Code Issues**: Check the official documentation or GitHub issues
2. **Application Issues**: Review `CLAUDE.md` and this setup guide
3. **MCP Server Issues**: Check the specific MCP server documentation
4. **Development Questions**: Ask Claude Code directly - it has full project context!

---

## Summary

This setup provides:

✅ **Full-Stack Development Environment**: Python/FastAPI backend + React/TypeScript frontend
✅ **AI-Powered Development**: Claude Code with project-specific instructions
✅ **Enhanced Capabilities**: MCP servers for documentation and browser automation
✅ **Specialized Agents**: UI/UX reviewer for design feedback
✅ **Custom Skills**: Component generator for rapid UI development
✅ **Production-Ready**: Caching, authentication, testing, and deployment-ready code

**Next Steps:**
1. Verify all prerequisites are installed
2. Set up the application (database, backend, frontend)
3. Configure Claude Code with MCP servers
4. Try the example workflows above
5. Start building features with Claude Code assistance!

**Happy Coding! 🚀**
