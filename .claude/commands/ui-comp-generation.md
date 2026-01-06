---
description: Generate a new React component with TypeScript and TailwindCSS
argument-hint: [ComponentName] [short description]
allowed-tools: Read, Glob, Write, Bash(npm:*)
---

# Generate React Component

Create a new React component named **$1** in `frontend/src/components/`.

## Component Description
$2

## Requirements

1. **File Location**: Create the component at `frontend/src/components/$1.tsx`

2. **Component Structure**:
   - Use TypeScript with proper type definitions
   - Use functional component with React.FC or explicit typing
   - Include props interface if needed
   - Follow React best practices (hooks, composition)

3. **Styling**:
   - Use TailwindCSS for styling (the project uses Tailwind)
   - Ensure responsive design
   - Follow the project's existing design patterns

4. **Code Quality**:
   - Add proper TypeScript types
   - Include JSDoc comments for complex logic
   - Handle edge cases and errors gracefully
   - Make it reusable and composable

5. **Best Practices**:
   - Check existing components in `frontend/src/components/` for patterns
   - Use semantic HTML elements
   - Include accessibility attributes (aria-labels, roles) where appropriate
   - Export as default from the file

## Example Output Structure

```typescript
interface ${1}Props {
  // Props interface based on the description
}

const $1: React.FC<${1}Props> = ({ /* props */ }) => {
  // Component implementation
  return (
    <div className="/* Tailwind classes */">
      {/* Component JSX */}
    </div>
  );
};

export default $1;
```

## Additional Files

After creating the component, also create:
- `frontend/src/components/$1.example.tsx` - Example usage of the component
- `frontend/src/components/$1.README.md` - Documentation with props, usage examples, and notes

## Steps

1. First, use Glob to check existing components in `frontend/src/components/` to understand naming and structure patterns
2. Create the main component file with full implementation
3. Create the example file showing how to use the component
4. Create the README with documentation
5. Verify the files were created successfully
