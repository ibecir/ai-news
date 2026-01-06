# build-ui-component Skill

A custom Claude Code skill for generating production-ready React components with TypeScript and TailwindCSS.

## Overview

This skill automatically creates React components following your project's conventions, complete with:
- Full TypeScript type safety
- TailwindCSS styling
- Accessibility features (ARIA labels)
- Comprehensive documentation
- Usage examples

## Usage

### Basic Syntax

```
build-ui-component <ComponentName> "<description>"
```

### Parameters

1. **ComponentName** (required): PascalCase component name (e.g., `Button`, `SearchBar`, `UserCard`)
2. **description** (required): Brief description of what the component does

### Examples

#### 1. Create a Button Component
```
build-ui-component Button "a reusable button with multiple variants and sizes"
```

This generates a Button component with:
- Multiple variants (primary, secondary, danger)
- Different sizes (sm, md, lg)
- Loading and disabled states
- Full accessibility support

#### 2. Create a Search Input
```
build-ui-component SearchInput "search input field with icon and real-time filtering"
```

This generates a SearchInput component with:
- Icon support
- Value and onChange props
- Placeholder and error handling
- Accessibility labels

#### 3. Create a Navigation Bar
```
build-ui-component NavBar "navigation bar with logo, menu items, and logout button"
```

This generates a NavBar component with:
- Logo/brand area
- Navigation items array
- Active state highlighting
- Responsive design

#### 4. Create a User Profile Card
```
build-ui-component UserCard "displays user information with avatar and actions"
```

This generates a UserCard component with:
- Avatar display
- User info fields
- Action buttons
- Click handlers

### Advanced Usage

#### With Project Context
The skill automatically integrates with your project:
- Uses existing Tailwind config (`frontend/tailwind.config.js`)
- Places components in appropriate folders (`components/auth/`, `components/common/`, etc.)
- Follows your TypeScript conventions
- Integrates with your API service (`services/api.ts`)

#### Example: Form Component with Validation
```
build-ui-component LoginForm "login form with email, password, and validation"
```

This generates:
- Form inputs with labels
- Client-side validation
- Error message display
- Submit handler integration
- Integration with auth store

## Output

After running the command, you'll receive:

1. **Component File**: Created at `frontend/src/components/{category}/{ComponentName}.tsx`
2. **Import Statement**: Ready-to-use import path
3. **Props Documentation**: Description of all props
4. **Usage Examples**: 3+ code examples showing how to use the component
5. **Integration Notes**: Project-specific guidance

Example output:
```
✅ Created component: Button
📁 Location: frontend/src/components/common/Button.tsx

## Usage

### Import
import { Button } from '@/components/common/Button';

### Props
- children: ReactNode - Button content
- variant: 'primary' | 'secondary' | 'danger' - Visual style (default: 'primary')
- size: 'sm' | 'md' | 'lg' - Button size (default: 'md')
- disabled: boolean - Disable button (default: false)
- onClick: () => void - Click handler

### Examples

1. Basic usage:
<Button variant="primary" onClick={handleSubmit}>
  Submit
</Button>

2. Danger variant:
<Button variant="danger" onClick={handleDelete}>
  Delete Account
</Button>

3. Small secondary button:
<Button variant="secondary" size="sm" onClick={handleCancel}>
  Cancel
</Button>
```

## Component Categories

Components are automatically placed in appropriate folders based on their purpose:

- **common/** - Reusable UI components (Button, Input, Card, Modal)
- **auth/** - Authentication-related components (LoginForm, RegisterForm)
- **dashboard/** - Dashboard-specific components (StatsCard, Chart)
- **links/** - Link management components (LinkList, LinkDetail)
- **layout/** - Layout components (NavBar, Sidebar, Footer)

The skill analyzes your description to determine the best category.

## Best Practices

The skill automatically applies these best practices:

### TypeScript
- ✅ Full type safety with interfaces
- ✅ No `any` types
- ✅ Proper prop typing
- ✅ Generic components where appropriate

### Accessibility
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Focus management

### Responsive Design
- ✅ Mobile-first approach
- ✅ Tailwind responsive classes
- ✅ Flexible layouts
- ✅ Touch-friendly targets

### Documentation
- ✅ JSDoc comments
- ✅ Prop descriptions
- ✅ Usage examples
- ✅ Integration notes

## Tips

### 1. Be Specific in Descriptions
```
❌ build-ui-component Card "a card"
✅ build-ui-component Card "content card with title, body, and optional footer"
```

### 2. Mention Key Features
```
❌ build-ui-component Input "input field"
✅ build-ui-component Input "text input with label, validation, and error messages"
```

### 3. Include States or Variants
```
❌ build-ui-component Button "button"
✅ build-ui-component Button "button with primary, secondary, and danger variants"
```

### 4. Specify Behavior
```
❌ build-ui-component Modal "modal"
✅ build-ui-component Modal "modal dialog with backdrop, close button, and keyboard support"
```

## Customization

After generation, you can:
1. Adjust the component logic
2. Add more variants or props
3. Customize Tailwind classes
4. Add additional states
5. Integrate with your stores/contexts

The generated component is a solid starting point that follows best practices.

## Troubleshooting

### Component not found after creation
- Check the output path in the confirmation message
- Look in `frontend/src/components/` subdirectories
- Verify TypeScript compilation passed

### Import errors
- Ensure you're using the correct import path from the output
- Check if an index.ts file needs to be updated
- Verify the component is exported correctly

### Styling issues
- Confirm Tailwind CSS is properly configured
- Check `frontend/tailwind.config.js`
- Run `npm run dev` to ensure Tailwind is compiling

## Project Integration

This skill integrates seamlessly with your project:

- **State Management**: Uses Zustand stores from `context/authStore.ts`
- **API Calls**: Leverages `services/api.ts` for backend communication
- **Routing**: Compatible with React Router v6
- **Styling**: Follows your Tailwind configuration

## Contributing

To improve this skill:
1. Edit `SKILL.md` to adjust instructions
2. Update `EXAMPLES.md` with new patterns
3. Commit changes to git to share with team
4. Test with various component types

## Examples Gallery

See `EXAMPLES.md` for complete reference implementations:
- Button with variants and loading states
- Input with validation and error handling
- Card with title and footer
- Modal with backdrop and keyboard support
- NavBar with active state highlighting
- List with loading and empty states

## Support

For issues or suggestions:
1. Check the generated component code
2. Review SKILL.md instructions
3. Consult EXAMPLES.md for patterns
4. Ask Claude for modifications
