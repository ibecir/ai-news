---
description: Create a new React component following project conventions
user_invocable: true
---

# UI Component Generator

Create a new React TypeScript component in the `frontend/src/components` directory following the project's established patterns and conventions.

## Component Requirements

When creating a component, follow these guidelines:

### File Structure
- Create components as `.tsx` files
- Place in appropriate subfolder:
  - `components/common/` - Reusable UI components (buttons, spinners, cards, modals)
  - `components/auth/` - Authentication-related components
  - `components/dashboard/` - Dashboard-specific components
  - `components/links/` - Link management components
  - Create new folders if needed for logical grouping

### TypeScript Patterns
- Use functional components with TypeScript
- Define prop interfaces as `ComponentNameProps`
- Export component as default
- Use React 18 hooks (useState, useEffect, useCallback, useMemo)

### Styling
- Use TailwindCSS utility classes (project uses TailwindCSS)
- Follow responsive design patterns (mobile-first)
- Common color scheme:
  - Primary: blue-600, blue-500
  - Success: green-600, green-500
  - Danger: red-600, red-500
  - Background: gray-50, white
  - Text: gray-900, gray-700, gray-600

### State Management
- For local state: Use `useState`
- For auth state: Import from `@/context/authStore` (Zustand store)
- For API calls: Use `@/services/api` singleton

### Common Patterns

#### API Integration Example
```typescript
import { api } from '@/services/api';
import type { APIResponse, SomeType } from '@/types';

const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await api.someEndpoint();
    // Handle response
  } catch (err) {
    setError('Failed to fetch data');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

#### Form Handling Example
```typescript
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Handle form submission
};
```

#### Loading States
Use the existing `LoadingSpinner` component:
```typescript
import LoadingSpinner from '@/components/common/LoadingSpinner';

if (loading) return <LoadingSpinner />;
```

### Accessibility
- Use semantic HTML elements
- Add proper ARIA labels for interactive elements
- Ensure keyboard navigation support
- Include alt text for images

### Component Template

```typescript
import React, { useState, useEffect } from 'react';
import type { SomeType } from '@/types';

interface ComponentNameProps {
  prop1: string;
  prop2?: number;
  onAction?: () => void;
}

const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2 = 0,
  onAction
}) => {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // Effect logic
  }, []);

  const handleClick = () => {
    // Handler logic
    onAction?.();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {prop1}
      </h2>

      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Click Me
      </button>
    </div>
  );
};

export default ComponentName;
```

## Instructions

When the user invokes this command with parameters:

**Usage**: `/ui-component ComponentName "short description"`

Example: `/ui-component LinkStatsCard "displays link statistics with counts"`

### Steps to Execute:

1. **Extract parameters from the command:**
   - Component name (first parameter, should be PascalCase)
   - Description (second parameter, used to infer functionality)

2. **Intelligently determine component location** based on naming and description:
   - If name/description contains "Auth", "Login", "Register", "Signup" → `auth/`
   - If name/description contains "Dashboard", "Stats", "Widget", "Chart" → `dashboard/`
   - If name/description contains "Link" and context suggests management → `links/`
   - Otherwise → `common/` (default for reusable components)

3. **Infer component features** from description:
   - Keywords like "form", "input", "submit", "edit" → Include form handling patterns
   - Keywords like "fetch", "load", "api", "data" → Include API integration patterns
   - Keywords like "display", "show", "card", "list" → Focus on presentation
   - Keywords like "button", "modal", "spinner" → Simple reusable UI component

4. **Create the component file** at `frontend/src/components/[folder]/[ComponentName].tsx`
   - Use appropriate imports based on inferred features
   - Include TypeScript interfaces with reasonable default props
   - Add error handling and loading states for API components
   - Use TailwindCSS classes following project color scheme
   - Export as default

5. **Provide concise output:**
   - Confirm component created with location
   - Show a brief usage example
   - Mention any related changes needed (types, routing, etc.)

### Handling Missing or Invalid Parameters

- If component name is missing or invalid (not PascalCase), ask for it
- If description is missing, ask for a brief description
- If both are provided, create the component immediately without further questions

## Example Usage

**Input**: `/ui-component VerificationBadge "shows verification status icon with color"`

**Action**:
- Create `frontend/src/components/common/VerificationBadge.tsx`
- Simple presentational component with props for status
- Include color variants based on verification state

**Input**: `/ui-component AddLinkForm "form to submit new links with validation"`

**Action**:
- Create `frontend/src/components/links/AddLinkForm.tsx`
- Include form state management, validation, and API submission
- Add error handling and loading states

**Review the Work**
- **Invoke the ui-ux-reviewer subagent** to reviewer your work and implement suggestions where needed
- Iterate on the review process when needed