# ModalComponent

A clean, modern, and accessible modal component for React with TypeScript and TailwindCSS.

## Features

✅ Clean, modern design with semi-transparent backdrop
✅ Smooth animations (fade in, slide up)
✅ Full keyboard accessibility with focus trapping
✅ ESC key and backdrop click to close
✅ Respects `prefers-reduced-motion`
✅ Multiple size variants (sm, md, lg, xl)
✅ Focus restoration when closed
✅ WCAG 2.1 Level AA compliant
✅ Fully testable with comprehensive test suite

## Quick Start

```tsx
import { useState } from 'react';
import ModalComponent from '@/components/common/ModalComponent';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <ModalComponent
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
      >
        <p>Your content here...</p>
      </ModalComponent>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Controls modal visibility |
| `onClose` | `() => void` | required | Callback when modal should close |
| `title` | `string` | `undefined` | Optional modal title |
| `children` | `ReactNode` | required | Modal content |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Modal width |
| `showCloseButton` | `boolean` | `true` | Show X button in header |
| `closeOnBackdropClick` | `boolean` | `true` | Close when clicking backdrop |
| `closeOnEscape` | `boolean` | `true` | Close when pressing ESC |

## Size Examples

```tsx
// Small modal (max-w-md)
<ModalComponent size="sm" {...props}>
  Confirmation dialog
</ModalComponent>

// Medium modal (max-w-lg) - Default
<ModalComponent size="md" {...props}>
  Contact form
</ModalComponent>

// Large modal (max-w-2xl)
<ModalComponent size="lg" {...props}>
  Terms and conditions
</ModalComponent>

// Extra large modal (max-w-4xl)
<ModalComponent size="xl" {...props}>
  Image gallery
</ModalComponent>
```

## Usage Examples

### Basic Modal with Title

```tsx
<ModalComponent
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Welcome"
>
  <p>Welcome to our application!</p>
</ModalComponent>
```

### Confirmation Dialog (No Title)

```tsx
<ModalComponent
  isOpen={isDeleteConfirmOpen}
  onClose={() => setIsDeleteConfirmOpen(false)}
  size="sm"
>
  <div className="text-center">
    <h3 className="text-lg font-semibold mb-2">
      Delete Item?
    </h3>
    <p className="text-gray-600 mb-4">
      This action cannot be undone.
    </p>
    <div className="flex gap-2 justify-center">
      <button onClick={() => setIsDeleteConfirmOpen(false)}>
        Cancel
      </button>
      <button onClick={handleDelete}>
        Delete
      </button>
    </div>
  </div>
</ModalComponent>
```

### Form Modal

```tsx
<ModalComponent
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  title="Contact Us"
  size="md"
>
  <form onSubmit={handleSubmit}>
    <input type="text" placeholder="Name" />
    <input type="email" placeholder="Email" />
    <textarea placeholder="Message" />
    <button type="submit">Send</button>
  </form>
</ModalComponent>
```

### Modal Without Close Button

```tsx
<ModalComponent
  isOpen={isLoadingOpen}
  onClose={() => {}}
  showCloseButton={false}
  closeOnBackdropClick={false}
  closeOnEscape={false}
>
  <div className="text-center py-8">
    <LoadingSpinner />
    <p>Processing...</p>
  </div>
</ModalComponent>
```

## Testing

The component is fully testable with comprehensive test coverage.

### Test IDs Available

- `modal-container` - Root modal container
- `modal-backdrop` - Semi-transparent backdrop
- `modal-content` - Modal card content
- `modal-header` - Header section
- `modal-title` - Modal title
- `modal-close-button` - Close (X) button
- `modal-body` - Content body

### Quick Test Example

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ModalComponent from './ModalComponent';

test('modal opens and closes', () => {
  const onClose = vi.fn();

  render(
    <ModalComponent isOpen={true} onClose={onClose}>
      <p>Content</p>
    </ModalComponent>
  );

  // Modal is visible
  expect(screen.getByTestId('modal-container')).toBeInTheDocument();

  // Click close button
  fireEvent.click(screen.getByTestId('modal-close-button'));
  expect(onClose).toHaveBeenCalled();
});
```

For comprehensive testing guide, see:
- `ModalComponent.test.tsx` - Full test suite
- `ModalComponent.testing-guide.md` - Detailed testing documentation

## Accessibility

The component follows WCAG 2.1 Level AA guidelines:

✅ **Keyboard Navigation**: Full keyboard support with Tab/Shift+Tab
✅ **Focus Management**: Auto-focus and focus trapping
✅ **Focus Restoration**: Returns focus to trigger element
✅ **ARIA Attributes**: Proper role, aria-modal, aria-labelledby
✅ **ESC Key**: Close with Escape key
✅ **Screen Reader**: Properly announced to assistive technology
✅ **Reduced Motion**: Respects prefers-reduced-motion
✅ **Color Contrast**: Sufficient contrast ratios

## Files

- `ModalComponent.tsx` - Main component
- `ModalComponent.test.tsx` - Test suite (300+ lines)
- `ModalComponent.example.tsx` - Usage examples
- `ModalComponent.testing-guide.md` - Testing documentation
- `ModalComponent.README.md` - This file

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- React 18+
- TypeScript 5+
- TailwindCSS 3+

## License

Part of the News Verifier project.
