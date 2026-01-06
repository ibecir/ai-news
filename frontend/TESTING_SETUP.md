# Testing Setup Guide

This guide will help you set up testing for the project.

## Prerequisites

Make sure you have Node.js and npm installed.

## Step 1: Install Testing Dependencies

Run the following command to install all necessary testing dependencies:

```bash
cd frontend

npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom
```

### What Each Package Does:

- **vitest**: Fast unit test framework (works seamlessly with Vite)
- **@vitest/ui**: Visual UI for viewing test results
- **jsdom**: JavaScript implementation of web standards for Node.js
- **@testing-library/react**: React testing utilities
- **@testing-library/jest-dom**: Custom matchers for DOM testing
- **@testing-library/user-event**: Fire events the same way users do
- **@testing-library/dom**: DOM testing utilities

## Step 2: Update package.json Scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

## Step 3: Configuration Files

The following configuration files have been created for you:

### ✅ vitest.config.ts
Located at: `frontend/vitest.config.ts`

This file configures Vitest to work with React and TypeScript.

### ✅ src/test/setup.ts
Located at: `frontend/src/test/setup.ts`

This file sets up the testing environment with necessary polyfills and cleanup.

## Step 4: Verify Setup

Run the tests to verify everything is working:

```bash
npm test
```

You should see the ModalComponent tests running successfully.

## Available Test Commands

### Run tests in watch mode (recommended for development)
```bash
npm test
```

### Run tests once (for CI/CD)
```bash
npm test:run
```

### Run tests with UI dashboard
```bash
npm test:ui
```

Then open your browser to the URL shown (usually http://localhost:51204/__vitest__/)

### Run tests with coverage report
```bash
npm test:coverage
```

Coverage reports will be generated in `coverage/` directory.

### Run specific test file
```bash
npm test ModalComponent
```

### Run tests matching a pattern
```bash
npm test -- --grep "closes on backdrop"
```

## Writing Your First Test

Create a test file alongside your component:

```typescript
// MyComponent.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Test File Naming Conventions

- Component tests: `ComponentName.test.tsx`
- Utility tests: `utilityName.test.ts`
- Integration tests: `feature.integration.test.tsx`

Place test files next to the files they test:
```
src/
  components/
    common/
      ModalComponent.tsx
      ModalComponent.test.tsx  ✅
```

## Common Testing Patterns

### Testing with Props
```typescript
it('renders with custom title', () => {
  render(<MyComponent title="Custom" />);
  expect(screen.getByText('Custom')).toBeInTheDocument();
});
```

### Testing User Interactions
```typescript
import { fireEvent } from '@testing-library/react';

it('handles click', () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click me</Button>);

  fireEvent.click(screen.getByText('Click me'));
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

### Testing Async Operations
```typescript
import { waitFor } from '@testing-library/react';

it('loads data', async () => {
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Mocking API Calls
```typescript
import { vi } from 'vitest';
import { api } from '@/services/api';

it('fetches data', async () => {
  const mockFetch = vi.spyOn(api, 'getData');
  mockFetch.mockResolvedValue({ data: 'test' });

  render(<MyComponent />);

  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalled();
  });

  mockFetch.mockRestore();
});
```

## Best Practices

1. **Test behavior, not implementation**
   - ❌ `expect(component.state.isOpen).toBe(true)`
   - ✅ `expect(screen.getByRole('dialog')).toBeInTheDocument()`

2. **Use semantic queries**
   - Prefer: `getByRole`, `getByLabelText`, `getByPlaceholderText`
   - Avoid: `getByClassName`, `getByTestId` (except when necessary)

3. **Keep tests simple and focused**
   - One test should test one thing
   - Tests should be easy to read and understand

4. **Use data-testid sparingly**
   - Only when semantic queries don't work
   - Example: `data-testid="modal-container"`

5. **Mock external dependencies**
   - API calls
   - Third-party libraries
   - Browser APIs

6. **Clean up after tests**
   - Already handled in `setup.ts`
   - But be aware of side effects

## Troubleshooting

### Issue: "Cannot find module '@testing-library/react'"
**Solution**: Run `npm install` to ensure all dependencies are installed.

### Issue: "ReferenceError: expect is not defined"
**Solution**: Make sure `vitest.config.ts` has `globals: true`.

### Issue: Tests are slow
**Solution**:
- Use `vi.fn()` instead of real implementations
- Mock heavy dependencies
- Use `test.concurrent` for independent tests

### Issue: "IntersectionObserver is not defined"
**Solution**: Already fixed in `setup.ts`, but if you see this, check the setup file is loaded.

### Issue: Path aliases not working (@/...)
**Solution**: Check that `vitest.config.ts` has the correct `resolve.alias` configuration.

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./frontend
        run: npm install

      - name: Run tests
        working-directory: ./frontend
        run: npm test:run

      - name: Generate coverage
        working-directory: ./frontend
        run: npm test:coverage
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Next Steps

1. Install the dependencies
2. Run the tests: `npm test`
3. Open the UI: `npm test:ui`
4. Start writing tests for your components!

For the ModalComponent specifically, see:
- `ModalComponent.test.tsx` - Comprehensive test suite
- `ModalComponent.testing-guide.md` - Detailed testing guide
