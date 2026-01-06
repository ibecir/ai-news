---
name: build-ui-component
description: Generate React components with TypeScript and TailwindCSS. Accepts component name and description as parameters. Use when creating new UI components, building component libraries, or implementing visual elements.
---

# Build UI Component

Generate production-ready React components with TypeScript and TailwindCSS following project conventions.

## Usage

This skill accepts two parameters:
1. **Component Name** (required): The name of the component (e.g., "NavBar", "SearchBox", "UserCard")
2. **Description** (required): Brief description of what the component does (e.g., "displays navigation links", "search input with autocomplete")

### Example Invocations

```
build-ui-component Button "a reusable button with multiple variants"
build-ui-component NavBar "navigation bar with logo and menu items"
build-ui-component SearchInput "search input field with icon and autocomplete"
```

## Instructions

When this skill is invoked with component name and description:

1. **Parse Input Parameters**
   - Extract component name (PascalCase format)
   - Extract component description
   - Validate naming conventions

2. **Analyze Requirements**
   - Determine appropriate props based on description
   - Identify common UI patterns (buttons, inputs, cards, etc.)
   - Consider states: default, hover, disabled, loading, error
   - Plan responsive behavior

3. **Generate Component File**
   - Create TypeScript file: `frontend/src/components/{category}/{ComponentName}.tsx`
   - Categories: common/, auth/, dashboard/, links/, or new category based on context
   - Use full TypeScript type safety
   - Apply TailwindCSS for all styling
   - Add comprehensive JSDoc comments
   - Include prop interfaces with descriptions

4. **Component Structure Requirements**
   ```typescript
   import { ReactNode } from 'react';

   /**
    * {Description from parameter}
    */
   interface {ComponentName}Props {
     // Props based on description and common patterns
   }

   /**
    * {ComponentName} - {Description}
    *
    * @example
    * <{ComponentName} prop1="value" prop2={value} />
    */
   export const {ComponentName} = ({ ...props }: {ComponentName}Props) => {
     // Implementation
     return (
       <div className="...">
         {/* Component JSX */}
       </div>
     );
   };
   ```

5. **Best Practices to Apply**
   - **Accessibility**: Include ARIA attributes (aria-label, aria-describedby, role)
   - **Responsive Design**: Use Tailwind responsive classes (sm:, md:, lg:)
   - **Edge Cases**: Handle empty states, errors, loading states
   - **Variants**: Support multiple visual variants when appropriate
   - **Composition**: Design for reusability and composition
   - **Type Safety**: Strict TypeScript, no `any` types
   - **Documentation**: Clear JSDoc with usage examples

6. **Generate Usage Documentation**
   After creating the component, provide:
   - Import statement
   - Props interface explanation
   - Usage examples (3+ scenarios)
   - Integration guidance with existing project
   - Any peer dependencies or requirements

7. **File Organization**
   - Place in appropriate category folder
   - Create index.ts for exports if needed
   - Follow project structure from CLAUDE.md

## Component Pattern Library

Based on description keywords, apply these patterns:

### Button/Action Components
- Variants: primary, secondary, danger, ghost
- Sizes: sm, md, lg
- States: default, hover, disabled, loading
- Props: onClick, disabled, loading, children

### Input Components
- Label, placeholder, error message
- Validation states
- Props: value, onChange, error, disabled, type

### Card/Container Components
- Title, children, footer
- Shadow and border options
- Props: title, children, className, onClick

### Navigation Components
- Logo/brand area
- Menu items array
- Active state indication
- Props: items, activePath, onNavigate

### Modal/Dialog Components
- Open/close state
- Backdrop overlay
- Focus management
- Props: isOpen, onClose, title, children

### List Components
- Empty state
- Loading state
- Item rendering
- Props: items, renderItem, loading, empty

## Example Output Format

After generating the component, provide output like:

```
✅ Created component: {ComponentName}
📁 Location: frontend/src/components/{category}/{ComponentName}.tsx

## Usage

### Import
import {{ {ComponentName} }} from '@/components/{category}/{ComponentName}';

### Props
- prop1: type - description
- prop2: type - description

### Examples

1. Basic usage:
<{ComponentName} prop1="value" />

2. With custom styling:
<{ComponentName} prop1="value" className="custom-class" />

3. Advanced usage:
<{ComponentName}
  prop1="value"
  prop2={{value}}
  onEvent={{handleEvent}}
/>

## Integration Notes
[Any specific integration guidance for this project]
```

## Project Context

- **Frontend Stack**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS (config: frontend/tailwind.config.js)
- **Component Location**: frontend/src/components/
- **Existing Categories**: auth/, dashboard/, links/, common/
- **API Service**: Use `services/api.ts` for API calls
- **State Management**: Zustand store in `context/authStore.ts`

## Checklist

Before finalizing:
- [ ] TypeScript interfaces for all props
- [ ] JSDoc comments on component and props
- [ ] TailwindCSS classes (no custom CSS)
- [ ] Accessibility attributes
- [ ] Responsive design
- [ ] Error/edge case handling
- [ ] Usage examples provided
- [ ] Proper file location
- [ ] Component exported correctly

## Common Patterns from Project

Reference existing components for patterns:
- `components/auth/` - Form patterns
- `components/dashboard/` - Card and stats patterns
- `components/links/` - List and detail view patterns
- `components/common/` - Reusable utilities (ProtectedRoute, LoadingSpinner)
