# ModalComponent Testing Guide

This guide explains how to test the `ModalComponent` in your application.

## Test IDs Available

The component includes the following `data-testid` attributes for easy testing:

| Test ID | Element | Description |
|---------|---------|-------------|
| `modal-container` | Root div | The main modal container with backdrop |
| `modal-backdrop` | Backdrop div | The semi-transparent backdrop overlay |
| `modal-content` | Content div | The white modal card containing header and body |
| `modal-header` | Header div | The header section (only when title or close button exist) |
| `modal-title` | Title h2 | The modal title (only when `title` prop is provided) |
| `modal-close-button` | Close button | The X button (only when `showCloseButton` is true) |
| `modal-body` | Body div | The content area containing children |

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Modal Component Tests Only
```bash
npm test ModalComponent
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

## Quick Testing Examples

### Example 1: Testing Modal Opens and Closes

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ModalComponent from './ModalComponent';

test('modal opens and closes', () => {
  const mockOnClose = vi.fn();

  const { rerender } = render(
    <ModalComponent isOpen={true} onClose={mockOnClose}>
      <p>Content</p>
    </ModalComponent>
  );

  // Check modal is visible
  expect(screen.getByTestId('modal-container')).toBeInTheDocument();

  // Click close button
  fireEvent.click(screen.getByTestId('modal-close-button'));
  expect(mockOnClose).toHaveBeenCalled();

  // Rerender as closed
  rerender(
    <ModalComponent isOpen={false} onClose={mockOnClose}>
      <p>Content</p>
    </ModalComponent>
  );

  // Check modal is hidden
  expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
});
```

### Example 2: Testing Backdrop Click

```typescript
test('closes on backdrop click', () => {
  const mockOnClose = vi.fn();

  render(
    <ModalComponent isOpen={true} onClose={mockOnClose} closeOnBackdropClick={true}>
      <p>Content</p>
    </ModalComponent>
  );

  fireEvent.click(screen.getByTestId('modal-backdrop'));
  expect(mockOnClose).toHaveBeenCalledTimes(1);
});
```

### Example 3: Testing ESC Key

```typescript
test('closes on ESC key press', () => {
  const mockOnClose = vi.fn();

  render(
    <ModalComponent isOpen={true} onClose={mockOnClose} closeOnEscape={true}>
      <p>Content</p>
    </ModalComponent>
  );

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(mockOnClose).toHaveBeenCalledTimes(1);
});
```

### Example 4: Testing Form Inside Modal

```typescript
test('handles form submission in modal', async () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  render(
    <ModalComponent isOpen={true} onClose={mockOnClose} title="Form">
      <form onSubmit={mockOnSubmit}>
        <input type="text" placeholder="Name" />
        <button type="submit">Submit</button>
      </form>
    </ModalComponent>
  );

  // Fill form
  const input = screen.getByPlaceholderText('Name');
  fireEvent.change(input, { target: { value: 'John' } });

  // Submit form
  const submitButton = screen.getByText('Submit');
  fireEvent.click(submitButton);

  expect(mockOnSubmit).toHaveBeenCalled();
});
```

### Example 5: Testing Accessibility

```typescript
test('modal has proper accessibility attributes', () => {
  render(
    <ModalComponent isOpen={true} onClose={vi.fn()} title="Accessible Modal">
      <p>Content</p>
    </ModalComponent>
  );

  const modal = screen.getByRole('dialog');

  // Check ARIA attributes
  expect(modal).toHaveAttribute('aria-modal', 'true');
  expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');

  // Check close button has label
  const closeButton = screen.getByTestId('modal-close-button');
  expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
});
```

### Example 6: Testing Focus Management

```typescript
import { waitFor } from '@testing-library/react';

test('focuses first element when opened', async () => {
  render(
    <ModalComponent isOpen={true} onClose={vi.fn()}>
      <button>First Button</button>
      <button>Second Button</button>
    </ModalComponent>
  );

  await waitFor(() => {
    expect(screen.getByText('First Button')).toHaveFocus();
  }, { timeout: 200 });
});
```

### Example 7: Testing Size Variants

```typescript
test.each([
  ['sm', 'max-w-md'],
  ['md', 'max-w-lg'],
  ['lg', 'max-w-2xl'],
  ['xl', 'max-w-4xl'],
])('applies %s size class', (size, expectedClass) => {
  render(
    <ModalComponent isOpen={true} onClose={vi.fn()} size={size as any}>
      <p>Content</p>
    </ModalComponent>
  );

  const content = screen.getByTestId('modal-content');
  expect(content).toHaveClass(expectedClass);
});
```

## Manual Testing Checklist

Use this checklist when manually testing the modal:

### Visual Testing
- [ ] Modal appears centered on screen
- [ ] Backdrop is semi-transparent and blurred
- [ ] Modal has rounded corners and shadow
- [ ] Animations are smooth (fade in, slide up)
- [ ] Close button (X) is clearly visible
- [ ] Title is readable and properly styled
- [ ] Content scrolls when it exceeds viewport height

### Interaction Testing
- [ ] Click close button → modal closes
- [ ] Click backdrop → modal closes (if enabled)
- [ ] Press ESC key → modal closes (if enabled)
- [ ] Click inside modal content → modal stays open
- [ ] Press Tab → focus moves through modal elements only
- [ ] Press Shift+Tab → focus moves backward through modal elements
- [ ] Close modal → focus returns to trigger element

### Responsive Testing
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1024px+ width)
- [ ] Close button is easily tappable on mobile
- [ ] Modal doesn't overflow viewport on small screens

### Accessibility Testing
- [ ] Screen reader announces modal when opened
- [ ] Screen reader reads title correctly
- [ ] Close button has descriptive label
- [ ] Focus is trapped within modal
- [ ] Can navigate with keyboard only
- [ ] Colors have sufficient contrast

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Common Testing Patterns

### Pattern 1: Testing with React Router

```typescript
import { BrowserRouter } from 'react-router-dom';

test('modal with navigation links', () => {
  render(
    <BrowserRouter>
      <ModalComponent isOpen={true} onClose={vi.fn()}>
        <a href="/about">About</a>
      </ModalComponent>
    </BrowserRouter>
  );

  expect(screen.getByText('About')).toHaveAttribute('href', '/about');
});
```

### Pattern 2: Testing with State Management (Zustand)

```typescript
import { useAuthStore } from '@/context/authStore';

test('modal displays user data from store', () => {
  const { getState } = useAuthStore;

  render(
    <ModalComponent isOpen={true} onClose={vi.fn()}>
      <p>Welcome, {getState().email}</p>
    </ModalComponent>
  );

  expect(screen.getByText(/Welcome,/)).toBeInTheDocument();
});
```

### Pattern 3: Testing with API Calls

```typescript
import { vi } from 'vitest';
import { api } from '@/services/api';

test('modal makes API call on submit', async () => {
  const mockApiCall = vi.spyOn(api, 'createLink');
  mockApiCall.mockResolvedValue({ data: { id: 1 } });

  render(
    <ModalComponent isOpen={true} onClose={vi.fn()}>
      <button onClick={() => api.createLink({ url: 'test' })}>
        Create
      </button>
    </ModalComponent>
  );

  fireEvent.click(screen.getByText('Create'));

  await waitFor(() => {
    expect(mockApiCall).toHaveBeenCalledWith({ url: 'test' });
  });
});
```

## Troubleshooting

### Issue: Tests fail with "Cannot find element"
**Solution**: Make sure the modal's `isOpen` prop is set to `true` in your test.

### Issue: Focus tests fail
**Solution**: Use `waitFor` with a timeout to allow focus management to complete:
```typescript
await waitFor(() => {
  expect(element).toHaveFocus();
}, { timeout: 200 });
```

### Issue: "Body overflow not reset" warning
**Solution**: Add cleanup in `afterEach`:
```typescript
afterEach(() => {
  document.body.style.overflow = 'unset';
});
```

### Issue: Event listener warnings
**Solution**: Ensure you're properly unmounting or rerendering with `isOpen={false}` to trigger cleanup.

## Best Practices

1. **Always mock the onClose callback** with `vi.fn()` to track calls
2. **Use data-testid** for stable selectors instead of classes
3. **Test accessibility** features like ARIA attributes and focus management
4. **Test both happy and unhappy paths** (e.g., with and without title)
5. **Clean up after tests** to prevent side effects on other tests
6. **Use waitFor** for async operations like focus changes
7. **Test user interactions** with userEvent instead of fireEvent when possible

## Additional Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Vitest Docs](https://vitest.dev)
- [Testing Accessibility](https://testing-library.com/docs/queries/byrole)
- [User Event API](https://testing-library.com/docs/user-event/intro)
