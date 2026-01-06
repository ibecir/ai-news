# Claude Agent Configuration Documentation

**Project:** AI News Verifier Platform
**Agent Type:** Claude Code (Sonnet 4.5)
**Configuration Date:** December 2024
**Document Version:** 1.0

---

## Integration Summary

| Component Type | Name | Primary Function | Status |
|----------------|------|------------------|--------|
| **MCP Server** | Context7 | Real-time documentation lookup | Active |
| **MCP Server** | Playwright | Browser automation & UI testing | Active |
| **Custom Skill** | build-ui-component | React component generation | Active |
| **Sub-Agent** | ui-ux-reviewer | UI/UX design analysis | Active |
| **Permission Set** | Project Tools | 22 authorized operations | Configured |
| **Project Context** | CLAUDE.md | Architecture & patterns | Loaded |

**Total Integrations:** 6 configured components
**Permissions:** 22 tool operations authorized
**Configuration Files:** 3 (`.mcp.json`, `settings.local.json`, `CLAUDE.md`)

---

## Table of Contents

1. [MCP Servers](#1-mcp-servers)
2. [Custom Skills](#2-custom-skills)
3. [Available Tools](#3-available-tools)
4. [Sub-Agents](#4-sub-agents)
5. [Permission Configuration](#5-permission-configuration)
6. [Integration Matrix](#6-integration-matrix)

---

## 1. MCP Servers

Model Context Protocol (MCP) servers extend Claude's capabilities through specialized external services.

### 1.1 Context7 Documentation Server

**Configuration Location:** `.mcp.json`

**Purpose:** Provides real-time access to up-to-date library and framework documentation.

**Technical Specifications:**
```json
{
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp", "--api-key", "ctx7sk-***"],
  "protocol": "stdio",
  "package": "@upstash/context7-mcp"
}
```

**Available Operations:**

| Operation | Function | Input | Output |
|-----------|----------|-------|--------|
| `resolve-library-id` | Map package name to Context7 ID | Library name string | Context7-compatible ID |
| `get-library-docs` | Fetch documentation | Library ID, topic, page, mode | Documentation content |

**Modes:**
- `code`: API references, code examples, function signatures
- `info`: Conceptual guides, architectural documentation

**Usage Context:**
- Lookup FastAPI patterns and async database operations
- Retrieve React Query and Zustand documentation
- Reference SQLAlchemy 2.0 async patterns
- Check TailwindCSS utility classes

**Supported Libraries (Project-Specific):**
- Backend: FastAPI, SQLAlchemy, Pydantic, Redis
- Frontend: React, TypeScript, Vite, TailwindCSS, React Router, Zustand
- Testing: Pytest, Vitest

**API Key:** Scope-limited project key (`ctx7sk-eb8cebe4-58cb-4d2d-87eb-3322d6056976`)

---

### 1.2 Playwright Browser Automation

**Configuration Location:** `.mcp.json`

**Purpose:** Browser automation for UI testing, screenshot capture, and component inspection.

**Technical Specifications:**
```json
{
  "type": "stdio",
  "command": "npx",
  "args": ["@playwright/mcp@latest"],
  "protocol": "stdio",
  "package": "@playwright/mcp@latest"
}
```

**Available Operations:**

| Operation | Function | Parameters | Use Case |
|-----------|----------|------------|----------|
| `browser_navigate` | Navigate to URL | `url` | Open application pages |
| `browser_snapshot` | Accessibility snapshot | `filename` (optional) | Capture page state |
| `browser_take_screenshot` | Visual screenshot | `element`, `filename`, `fullPage`, `type` | Document UI state |
| `browser_resize` | Change viewport | `width`, `height` | Test responsive design |
| `browser_click` | Click element | `element`, `ref`, `button`, `modifiers` | Interact with UI |
| `browser_type` | Type text | `element`, `ref`, `text`, `slowly` | Fill form fields |
| `browser_hover` | Hover element | `element`, `ref` | Test hover states |
| `browser_press_key` | Keyboard input | `key` | Test keyboard nav |
| `browser_close` | Close browser | - | Clean up session |
| `browser_run_code` | Execute Playwright code | `code` | Custom interactions |
| `browser_evaluate` | Run JavaScript | `function`, `element`, `ref` | Inspect page state |
| `browser_console_messages` | Get console logs | `level` | Debug JavaScript |
| `browser_network_requests` | View network calls | `includeStatic` | Debug API calls |

**Configured Viewports:**
- Mobile: 375px width
- Tablet: 768px width
- Desktop: 1440px width

**File Output:** Screenshots saved to project root or `.playwright-mcp/` directory

**Permissions:** All browser operations pre-approved (no user confirmation required)

---

## 2. Custom Skills

Skills are invokable commands that automate complex development tasks.

### 2.1 build-ui-component

**Skill Type:** Component Generator
**Location:** `.claude/skills/build-ui-component/`
**Invocation:** `build-ui-component <ComponentName> "<description>"`

**Purpose:** Generate production-ready React components with TypeScript and TailwindCSS following project conventions.

**Technical Architecture:**

```
Input Parameters:
├── Component Name (PascalCase, required)
└── Description (string, required)

Processing Pipeline:
├── Parse and validate input
├── Analyze requirements from description
├── Determine component category
├── Generate TypeScript interfaces
├── Apply accessibility patterns
├── Generate TailwindCSS styling
└── Create usage documentation

Output:
├── Component file (.tsx)
├── TypeScript interfaces
├── JSDoc documentation
└── Usage examples (3+)
```

**Component Categories:**

| Category | Location | Purpose | Examples |
|----------|----------|---------|----------|
| `common/` | `components/common/` | Reusable UI primitives | Button, Input, Card, Modal |
| `auth/` | `components/auth/` | Authentication UI | LoginForm, RegisterForm |
| `dashboard/` | `components/dashboard/` | Dashboard-specific | StatsCard, Chart, MetricDisplay |
| `links/` | `components/links/` | Link management | LinkList, LinkDetail, LinkForm |
| `layout/` | `components/layout/` | Page structure | NavBar, Sidebar, Footer |

**Pattern Library:**

The skill applies these patterns based on description keywords:

| Pattern | Variants | States | Key Props |
|---------|----------|--------|-----------|
| **Button** | primary, secondary, danger, ghost | default, hover, disabled, loading | onClick, disabled, loading, children |
| **Input** | text, email, password, number | default, error, disabled, focus | value, onChange, error, disabled, type |
| **Card** | default, hoverable, clickable | default, hover | title, children, footer, onClick |
| **Modal** | sm, md, lg | open, closed | isOpen, onClose, title, children |
| **Navigation** | horizontal, vertical | - | items[], activePath, onNavigate |
| **List** | grid, stack | loading, empty, populated | items[], renderItem, loading, emptyMessage |

**Generated Code Standards:**

✅ **TypeScript:**
- Strict type safety (no `any` types)
- Interface-based prop definitions
- Generic components where applicable
- Proper ReactNode typing

✅ **Accessibility:**
- ARIA labels (`aria-label`, `aria-labelledby`)
- ARIA states (`aria-disabled`, `aria-invalid`)
- ARIA live regions (`role="alert"`, `aria-live`)
- Keyboard navigation support
- Focus management
- Screen reader text (`sr-only`)
- Semantic HTML elements

✅ **Responsive Design:**
- Mobile-first approach
- Tailwind breakpoints (sm:, md:, lg:, xl:)
- Flexible layouts (flex, grid)
- Touch-friendly targets (min 44x44px)

✅ **Best Practices:**
- JSDoc documentation
- Component composition patterns
- Edge case handling (empty, error, loading)
- No inline styles (TailwindCSS only)
- Proper event handler typing
- Controlled component patterns

**Example Invocations:**

```
build-ui-component Button "reusable button with primary, secondary, danger variants"
→ Generates: components/common/Button.tsx with 4 variants, 3 sizes, loading state

build-ui-component SearchInput "search input with icon, debounced filtering, clear button"
→ Generates: components/common/SearchInput.tsx with icon, debounce logic, handlers

build-ui-component UserCard "displays user avatar, name, email, and action buttons"
→ Generates: components/dashboard/UserCard.tsx with avatar fallback, layout
```

**Output Format:**

Every skill invocation produces:
1. Component file at correct location
2. Import statement for usage
3. Props interface documentation
4. 3+ usage examples (basic, styled, advanced)
5. Integration notes for project-specific patterns

---

## 3. Available Tools

Tools are atomic operations available to the Claude agent.

### 3.1 Tool Categories

**Total Tools:** 30+ operations across 7 categories

### 3.2 File System Tools

| Tool | Operation | Parameters | Permissions |
|------|-----------|------------|-------------|
| `Read` | Read file contents | `file_path`, `offset`, `limit` | Unrestricted |
| `Write` | Create/overwrite file | `file_path`, `content` | Requires file read first |
| `Edit` | String replacement | `file_path`, `old_string`, `new_string`, `replace_all` | Requires file read first |
| `Glob` | Pattern file search | `pattern`, `path` | Unrestricted |
| `Grep` | Content search | `pattern`, `path`, `glob`, `type`, `output_mode` | Unrestricted |

**Supported Formats:**
- Text files (all)
- Images (PNG, JPG - visual display)
- PDF (page-by-page extraction)
- Jupyter notebooks (.ipynb - cell-by-cell)

**Search Capabilities:**
- Regex patterns (ripgrep syntax)
- Glob filtering (`*.js`, `**/*.tsx`)
- Type filtering (js, py, rust, etc.)
- Context lines (-A, -B, -C)
- Multiline matching

---

### 3.3 Shell Execution Tools

| Tool | Operation | Parameters | Permissions |
|------|-----------|------------|-------------|
| `Bash` | Execute shell command | `command`, `timeout`, `run_in_background` | Selective (see whitelist) |
| `TaskOutput` | Get async task output | `task_id`, `block`, `timeout` | Unrestricted |
| `KillShell` | Terminate background shell | `shell_id` | Unrestricted |

**Whitelisted Bash Commands:**

| Pattern | Purpose | Examples |
|---------|---------|----------|
| `find:*` | File system search | `find . -name "*.tsx"` |
| `curl:*` | HTTP requests | `curl http://localhost:8000/api/v1/links` |
| `npm run dev:*` | Dev server commands | `npm run dev`, `npm run dev:frontend` |
| `cat:*` | File viewing | `cat package.json` |
| `claude mcp add:*` | MCP management | `claude mcp add playwright` |
| `pkill:*` | Process termination | `pkill -f "npm run dev"` |
| `chmod:*` | Permission changes | `chmod +x script.sh` |

**Timeout:** Default 120s, maximum 600s
**Background Execution:** Supported via `run_in_background=true`

---

### 3.4 Language Server Protocol (LSP) Tools

| Tool | Operation | Parameters | Purpose |
|------|-----------|------------|---------|
| `LSP` | Code intelligence | `operation`, `filePath`, `line`, `character` | Navigate and inspect code |

**LSP Operations:**

| Operation | Function | Use Case |
|-----------|----------|----------|
| `goToDefinition` | Find symbol definition | Jump to function/class definition |
| `findReferences` | Find symbol usage | See all references to a function |
| `hover` | Get documentation | View type info and docs |
| `documentSymbol` | List file symbols | See all functions/classes in file |
| `workspaceSymbol` | Search symbols | Find symbols across project |
| `goToImplementation` | Find implementations | Locate interface implementations |
| `prepareCallHierarchy` | Get call hierarchy | Analyze function call chains |
| `incomingCalls` | Find callers | See what calls this function |
| `outgoingCalls` | Find callees | See what this function calls |

**Note:** LSP servers must be configured for file types (TypeScript, Python)

---

### 3.5 Agent Orchestration Tools

| Tool | Operation | Parameters | Purpose |
|------|-----------|------------|---------|
| `Task` | Launch specialized agent | `subagent_type`, `prompt`, `description`, `model`, `resume`, `run_in_background` | Delegate complex tasks |
| `Skill` | Execute skill | `skill`, `args` | Invoke custom skills |

**Available Sub-agent Types:**

| Type | Purpose | Tools Available | Model |
|------|---------|-----------------|-------|
| `general-purpose` | Complex multi-step tasks | All tools | Configurable |
| `Explore` | Codebase exploration | Glob, Grep, Read | Haiku/Sonnet |
| `Plan` | Implementation planning | All tools | Sonnet |
| `claude-code-guide` | Documentation lookup | Glob, Grep, Read, WebFetch | Sonnet |
| `ui-ux-reviewer` | UI/UX analysis (custom) | All tools | Sonnet |

---

### 3.6 MCP Server Tools

**Context7 Tools:**

| Tool | Function | Parameters |
|------|----------|------------|
| `mcp__context7__resolve-library-id` | Resolve library name to ID | `libraryName` |
| `mcp__context7__get-library-docs` | Fetch documentation | `context7CompatibleLibraryID`, `mode`, `topic`, `page` |

**Playwright Tools:** (14 operations - see section 1.2 for full list)

| Tool | Function | Pre-Approved |
|------|----------|--------------|
| `mcp__playwright__browser_navigate` | Navigate to URL | ✅ Yes |
| `mcp__playwright__browser_snapshot` | Capture accessibility tree | ✅ Yes |
| `mcp__playwright__browser_take_screenshot` | Take screenshot | ✅ Yes |
| `mcp__playwright__browser_resize` | Resize viewport | ✅ Yes |
| `mcp__playwright__browser_click` | Click element | ✅ Yes |
| `mcp__playwright__browser_hover` | Hover element | ✅ Yes |
| `mcp__playwright__browser_close` | Close browser | ✅ Yes |
| `mcp__playwright__browser_run_code` | Execute Playwright code | ✅ Yes |
| (6 more operations) | Various browser actions | ✅ Yes |

---

### 3.7 Development Tools

| Tool | Operation | Parameters | Purpose |
|------|-----------|------------|---------|
| `WebFetch` | Fetch and analyze URL | `url`, `prompt` | Retrieve web content |
| `WebSearch` | Search the web | `query`, `allowed_domains`, `blocked_domains` | Current information lookup |
| `TodoWrite` | Manage task list | `todos[]` | Track progress |
| `AskUserQuestion` | Interactive prompts | `questions[]` | Clarify requirements |

**IDE Integration:**

| Tool | Function | Parameters |
|------|----------|------------|
| `mcp__ide__getDiagnostics` | Get IDE diagnostics | `uri` (optional) |

---

### 3.8 Notebook Tools

| Tool | Operation | Parameters | Purpose |
|------|-----------|------------|---------|
| `NotebookEdit` | Edit Jupyter cells | `notebook_path`, `cell_id`, `new_source`, `cell_type`, `edit_mode` | Modify .ipynb files |

**Edit Modes:** `replace`, `insert`, `delete`
**Cell Types:** `code`, `markdown`

---

## 4. Sub-Agents

Sub-agents are specialized AI agents invoked for specific task categories.

### 4.1 UI/UX Reviewer Agent

**Agent Type:** Specialized Design Analyst
**Configuration:** `.claude/agents/ui-ux-reviewer.md`
**Model:** Claude Sonnet 4.5
**Color Tag:** Cyan

**Purpose:** Expert UI/UX analysis of React components with visual design, user experience, and accessibility audits.

**Capabilities:**

| Domain | Analysis Areas | Deliverables |
|--------|----------------|--------------|
| **Visual Design** | Layout, typography, color theory, spacing, consistency | Design critique with TailwindCSS fixes |
| **User Experience** | Cognitive load, user flows, affordances, feedback mechanisms | UX recommendations with priorities |
| **Accessibility** | WCAG 2.1 AA compliance, keyboard nav, screen readers | Accessibility audit with code fixes |

**Technical Methodology:**

1. **Browser Inspection:**
   - Uses Playwright MCP to navigate to component
   - Takes screenshots at 3 viewport sizes (375px, 768px, 1440px)
   - Interacts with elements (hover, focus, click, keyboard)
   - Captures multiple states (default, error, loading, disabled)

2. **Visual Analysis:**
   - Evaluates spacing consistency (margin, padding alignment)
   - Checks typography hierarchy (sizes, weights, line-height)
   - Analyzes color contrast ratios (WCAG requirements)
   - Reviews visual balance and white space
   - Assesses component proportions and sizing
   - Validates border radius, shadow, depth consistency

3. **UX Evaluation:**
   - Measures cognitive load and information hierarchy
   - Evaluates call-to-action clarity
   - Analyzes user flow efficiency
   - Reviews feedback mechanisms (loading, success, error)
   - Tests interactive element discoverability
   - Validates form field clarity and validation messages

4. **Accessibility Audit:**
   - WCAG 2.1 Level AA compliance check
   - Color contrast verification (4.5:1 normal, 3:1 large text)
   - Keyboard navigation testing
   - Screen reader compatibility check (semantic HTML, ARIA)
   - Alternative text validation
   - Form label and error associations
   - Focus management review
   - Touch target size verification (min 44x44px)

**Review Output Structure:**

```
🎨 Visual Design (Critical/High/Medium/Low issues)
├── Specific measurements and comparisons
├── TailwindCSS class recommendations
└── Before/after suggestions

👤 User Experience
├── Friction point identification
├── Interaction improvements with rationale
└── Missing affordances

♿ Accessibility
├── WCAG violations with criteria references
├── Code examples for fixes
└── Prioritized by user impact

✅ Strengths
└── Best practices being followed

🔧 Actionable Recommendations
├── Must Fix (critical path blockers)
├── Should Fix (important improvements)
└── Nice to Have (enhancements)
```

**Invocation Triggers:**

- Explicit request: "Review the DashboardStats component"
- After component creation: "I just built a new LoginForm"
- Before deployment: "Is this modal accessible?"
- Proactive: After detecting significant UI changes

**Integration Context:**

- Aware of project tech stack (React, TypeScript, TailwindCSS)
- References existing design patterns in codebase
- Provides TailwindCSS-specific recommendations
- Suggests TypeScript prop improvements for accessibility

**Quality Standards:**

- **Specificity:** Concrete measurements and class names (not vague suggestions)
- **Constructive:** Frames as improvement opportunities
- **Comprehensive:** Covers all three pillars (visual, UX, accessibility)
- **Practical:** Implementable within current tech stack
- **Evidence-based:** References captured screenshots

---

## 5. Permission Configuration

**Configuration Location:** `.claude/settings.local.json`

### 5.1 Authorized Operations

**Total Pre-Approved Permissions:** 22 operations

| Permission | Scope | Purpose |
|------------|-------|---------|
| `Bash(find:*)` | File system search | Locate files and directories |
| `Bash(curl:*)` | HTTP requests | Test APIs and fetch resources |
| `Bash(npm run dev:*)` | Development servers | Start/restart dev servers |
| `Bash(cat:*)` | File viewing | Quick file inspection |
| `Bash(claude mcp add:*)` | MCP management | Install MCP servers |
| `Bash(pkill:*)` | Process management | Stop development servers |
| `Bash(chmod:*)` | Permission changes | Make scripts executable |
| `mcp__context7__resolve-library-id` | Documentation lookup | Resolve package names |
| `mcp__context7__get-library-docs` | Documentation retrieval | Fetch library docs |
| `mcp__playwright__browser_navigate` | Browser control | Navigate to URLs |
| `mcp__playwright__browser_snapshot` | Page inspection | Capture page state |
| `mcp__playwright__browser_take_screenshot` | Visual capture | Screenshot components |
| `mcp__playwright__browser_resize` | Viewport testing | Test responsive design |
| `mcp__playwright__browser_click` | Element interaction | Click UI elements |
| `mcp__playwright__browser_press_key` | Keyboard input | Test keyboard nav |
| `mcp__playwright__browser_close` | Session cleanup | Close browser |
| `mcp__playwright__browser_hover` | Hover testing | Test hover states |
| `mcp__playwright__browser_run_code` | Custom automation | Execute Playwright scripts |

### 5.2 MCP Server Settings

```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["context7"]
}
```

**Behavior:**
- All MCP servers defined in `.mcp.json` are automatically enabled
- Context7 server explicitly enabled
- Playwright server enabled via `enableAllProjectMcpServers`

---

## 6. Integration Matrix

### 6.1 Component Interactions

| Source | Target | Interaction Type | Purpose |
|--------|--------|------------------|---------|
| Main Agent | Context7 MCP | Tool invocation | Documentation lookup |
| Main Agent | Playwright MCP | Tool invocation | Browser automation |
| Main Agent | build-ui-component | Skill execution | Component generation |
| Main Agent | ui-ux-reviewer | Sub-agent delegation | UI/UX analysis |
| ui-ux-reviewer | Playwright MCP | Tool invocation | Screenshot capture |
| build-ui-component | File System Tools | Direct usage | File creation |
| Main Agent | CLAUDE.md | Context loading | Project patterns |

### 6.2 Workflow Patterns

**Pattern 1: Component Development Workflow**
```
User Request
    ↓
Main Agent analyzes request
    ↓
Executes build-ui-component skill
    ↓
Generates component using File System Tools (Write, Edit)
    ↓
Invokes ui-ux-reviewer sub-agent
    ↓
ui-ux-reviewer uses Playwright MCP (navigate, screenshot, snapshot)
    ↓
Returns design feedback to Main Agent
    ↓
Main Agent implements recommendations using Edit tool
```

**Pattern 2: Documentation Lookup Workflow**
```
User Request: "How do I implement X in FastAPI?"
    ↓
Main Agent → Context7 MCP resolve-library-id(FastAPI)
    ↓
Context7 MCP → Returns library ID
    ↓
Main Agent → Context7 MCP get-library-docs(ID, topic="X", mode="code")
    ↓
Context7 MCP → Returns documentation
    ↓
Main Agent synthesizes answer with code examples
```

**Pattern 3: UI Testing Workflow**
```
User Request: "Test the login form responsiveness"
    ↓
Main Agent → Playwright MCP navigate(localhost:3000/login)
    ↓
Playwright MCP → Page loaded
    ↓
Main Agent → Playwright MCP resize(375, 667) [mobile]
    ↓
Main Agent → Playwright MCP take_screenshot(fullPage=true)
    ↓
Main Agent → Playwright MCP resize(1440, 900) [desktop]
    ↓
Main Agent → Playwright MCP take_screenshot(fullPage=true)
    ↓
Main Agent analyzes screenshots and provides feedback
```

### 6.3 Tool Usage Statistics (Typical Session)

| Tool Category | Frequency | Primary Use Cases |
|---------------|-----------|-------------------|
| File System (Read/Write/Edit) | High (40-50%) | Component development, refactoring |
| Grep/Glob | Medium (20-25%) | Code search, pattern finding |
| Bash | Medium (15-20%) | Dev server management, testing |
| MCP (Context7) | Low (5-10%) | Documentation queries |
| MCP (Playwright) | Low (5-10%) | UI testing, screenshots |
| LSP | Low (<5%) | Code navigation, refactoring |
| Sub-agents | Low (<5%) | Specialized analysis |

---

## Configuration Files Reference

### File 1: `.mcp.json`
**Purpose:** MCP server definitions
**Location:** Project root
**Size:** 23 lines
**Servers:** 2 (Context7, Playwright)

### File 2: `.claude/settings.local.json`
**Purpose:** Permissions and MCP settings
**Location:** `.claude/`
**Size:** 28 lines
**Permissions:** 22 authorized operations

### File 3: `CLAUDE.md`
**Purpose:** Project-specific instructions and patterns
**Location:** Project root
**Size:** ~400 lines
**Sections:** Commands, Architecture, API, Environment, Caching

### File 4: `.claude/agents/ui-ux-reviewer.md`
**Purpose:** UI/UX reviewer agent definition
**Location:** `.claude/agents/`
**Size:** 118 lines
**Type:** Custom sub-agent

### File 5: `.claude/skills/build-ui-component/SKILL.md`
**Purpose:** Component generator skill instructions
**Location:** `.claude/skills/build-ui-component/`
**Size:** 199 lines
**Type:** Custom skill

### File 6: `.claude/skills/build-ui-component/EXAMPLES.md`
**Purpose:** Component pattern library
**Location:** `.claude/skills/build-ui-component/`
**Size:** 462 lines
**Patterns:** 6 (Button, Input, Card, Modal, NavBar, List)

---

## Technical Specifications

### System Requirements

| Component | Requirement | Purpose |
|-----------|-------------|---------|
| Claude Code CLI | Latest version | Agent runtime |
| Node.js | 18+ | MCP server execution (npx) |
| Python | 3.10+ | Project backend |
| Playwright | Latest | Browser automation |
| Network Access | Internet connection | MCP server communication |

### Performance Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Average Component Generation Time | 15-30s | build-ui-component skill |
| Average UI Review Time | 45-90s | ui-ux-reviewer with screenshots |
| Context7 Documentation Lookup | 2-5s | Per query |
| Playwright Screenshot | 3-8s | Per viewport size |
| File System Operations | <1s | Read/Write/Edit |

### Resource Usage

| Resource | Typical | Peak | Notes |
|----------|---------|------|-------|
| Token Usage | 5K-15K | 50K+ | Per complex task |
| MCP Server Memory | 50-100MB | 200MB | Per active server |
| Browser Memory | 200-500MB | 1GB+ | Playwright sessions |
| File Operations | 10-50 | 200+ | Per development session |

---

## Maintenance and Updates

### MCP Server Updates

**Context7:**
- Update: `npm install -g @upstash/context7-mcp@latest`
- Version: Automatically uses latest via `npx -y`
- Breaking Changes: Monitor package changelog

**Playwright:**
- Update: `npm install -g @playwright/mcp@latest`
- Browser Update: `npx playwright install`
- Version: Automatically uses latest via `@playwright/mcp@latest`

### Skill and Agent Updates

**Location:** `.claude/skills/` and `.claude/agents/`

**Update Process:**
1. Edit `.md` files directly
2. No restart required (changes loaded on next invocation)
3. Test with simple examples before complex use
4. Version control via git

### Permission Updates

**File:** `.claude/settings.local.json`

**Adding Permissions:**
```json
{
  "permissions": {
    "allow": [
      "Bash(new-command:*)"  // Add new pattern
    ]
  }
}
```

**Requires:** Claude Code restart

---

## Security Considerations

### Permission Model

- **Whitelist-based:** Only explicitly allowed operations execute without confirmation
- **Bash restrictions:** Limited to safe, read-only, or development operations
- **No destructive operations:** Force push, hard reset, system modifications require confirmation
- **MCP isolation:** Servers run in isolated processes

### API Keys

- **Context7:** Project-scoped API key, read-only access
- **Playwright:** No authentication required (local execution)
- **Storage:** API keys in `.mcp.json` (gitignored in production)

### Data Privacy

- **MCP servers:** External communication limited to Context7 and npm registry
- **No telemetry:** Claude Code does not send usage data to third parties
- **Local execution:** All operations except Context7 docs run locally

---

## Appendix A: Quick Reference

### Command Syntax

```bash
# Skill Invocation
build-ui-component ComponentName "description"

# Agent Invocation (via prompt)
"Use the ui-ux-reviewer agent to review the LoginForm component"

# MCP Server Management
claude mcp add server-name --scope project npx package-name
claude mcp list
claude mcp remove server-name
```

### Common Task Patterns

| Task | Tools Used | Typical Workflow |
|------|-----------|------------------|
| Create Component | Skill → Write/Edit | `build-ui-component` → File generation |
| Review UI | Sub-agent → Playwright | Invoke agent → Browser screenshots → Analysis |
| Look up Docs | Context7 MCP | Resolve library → Get docs → Apply |
| Test Endpoint | Bash (curl) | `curl` API → Analyze response |
| Search Code | Grep/Glob | Pattern search → Read files → Understand |
| Refactor Code | Read → Edit | Read code → String replacement → Verify |

### File System Paths

| Type | Path | Purpose |
|------|------|---------|
| MCP Config | `.mcp.json` | MCP server definitions |
| Settings | `.claude/settings.local.json` | Permissions & settings |
| Skills | `.claude/skills/{skill}/` | Custom skill definitions |
| Agents | `.claude/agents/` | Custom agent definitions |
| Project Docs | `CLAUDE.md` | Project instructions |
| Components | `frontend/src/components/` | Generated components |

---

## Document Metadata

**Last Updated:** December 26, 2024
**Configuration Version:** 1.0
**Agent Version:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Total Pages:** 7
**Word Count:** ~5,500 words
