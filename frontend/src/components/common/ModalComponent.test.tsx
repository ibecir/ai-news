import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalComponent from './ModalComponent';

describe('ModalComponent', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    children: <div>Test Content</div>,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    // Cleanup body overflow style
    document.body.style.overflow = 'unset';
  });

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(<ModalComponent {...defaultProps} />);

      expect(screen.getByTestId('modal-container')).toBeInTheDocument();
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(<ModalComponent {...defaultProps} isOpen={false} />);

      expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
    });

    it('should render with title when provided', () => {
      render(<ModalComponent {...defaultProps} title="Test Title" />);

      expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should not render title when not provided', () => {
      render(<ModalComponent {...defaultProps} />);

      expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
    });

    it('should render close button by default', () => {
      render(<ModalComponent {...defaultProps} />);

      expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
    });

    it('should not render close button when showCloseButton is false', () => {
      render(<ModalComponent {...defaultProps} showCloseButton={false} />);

      expect(screen.queryByTestId('modal-close-button')).not.toBeInTheDocument();
    });

    it('should render backdrop', () => {
      render(<ModalComponent {...defaultProps} />);

      expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should apply small size class', () => {
      render(<ModalComponent {...defaultProps} size="sm" />);
      const content = screen.getByTestId('modal-content');

      expect(content).toHaveClass('max-w-md');
    });

    it('should apply medium size class by default', () => {
      render(<ModalComponent {...defaultProps} />);
      const content = screen.getByTestId('modal-content');

      expect(content).toHaveClass('max-w-lg');
    });

    it('should apply large size class', () => {
      render(<ModalComponent {...defaultProps} size="lg" />);
      const content = screen.getByTestId('modal-content');

      expect(content).toHaveClass('max-w-2xl');
    });

    it('should apply extra large size class', () => {
      render(<ModalComponent {...defaultProps} size="xl" />);
      const content = screen.getByTestId('modal-content');

      expect(content).toHaveClass('max-w-4xl');
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      render(<ModalComponent {...defaultProps} />);

      const closeButton = screen.getByTestId('modal-close-button');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked and closeOnBackdropClick is true', () => {
      render(<ModalComponent {...defaultProps} closeOnBackdropClick={true} />);

      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when backdrop is clicked and closeOnBackdropClick is false', () => {
      render(<ModalComponent {...defaultProps} closeOnBackdropClick={false} />);

      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when modal content is clicked', () => {
      render(<ModalComponent {...defaultProps} />);

      const content = screen.getByTestId('modal-content');
      fireEvent.click(content);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when ESC key is pressed and closeOnEscape is true', () => {
      render(<ModalComponent {...defaultProps} closeOnEscape={true} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when ESC key is pressed and closeOnEscape is false', () => {
      render(<ModalComponent {...defaultProps} closeOnEscape={false} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when other keys are pressed', () => {
      render(<ModalComponent {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'a' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Management', () => {
    it('should prevent body scroll when modal is open', () => {
      render(<ModalComponent {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when modal is closed', () => {
      const { rerender } = render(<ModalComponent {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<ModalComponent {...defaultProps} isOpen={false} />);

      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      render(<ModalComponent {...defaultProps} />);

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      render(<ModalComponent {...defaultProps} />);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby when title is provided', () => {
      render(<ModalComponent {...defaultProps} title="Test Title" />);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should have aria-label when title is not provided', () => {
      render(<ModalComponent {...defaultProps} />);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-label', 'Dialog');
    });

    it('should have aria-hidden on backdrop', () => {
      render(<ModalComponent {...defaultProps} />);

      const backdrop = screen.getByTestId('modal-backdrop');
      expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have aria-label on close button', () => {
      render(<ModalComponent {...defaultProps} />);

      const closeButton = screen.getByTestId('modal-close-button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });

    it('should focus first focusable element when opened', async () => {
      render(
        <ModalComponent {...defaultProps}>
          <button>First Button</button>
          <button>Second Button</button>
        </ModalComponent>
      );

      await waitFor(() => {
        expect(screen.getByText('First Button')).toHaveFocus();
      }, { timeout: 200 });
    });

    it('should trap focus within modal when Tab is pressed', async () => {
      const user = userEvent.setup();

      render(
        <ModalComponent {...defaultProps} title="Test">
          <button>First Button</button>
          <button>Second Button</button>
        </ModalComponent>
      );

      // Wait for initial focus
      await waitFor(() => {
        const closeButton = screen.getByTestId('modal-close-button');
        expect(closeButton).toHaveFocus();
      }, { timeout: 200 });

      // Tab through elements
      await user.tab();
      expect(screen.getByText('First Button')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Second Button')).toHaveFocus();

      // Should wrap back to close button
      await user.tab();
      const closeButton = screen.getByTestId('modal-close-button');
      expect(closeButton).toHaveFocus();
    });

    it('should trap focus in reverse when Shift+Tab is pressed', async () => {
      const user = userEvent.setup();

      render(
        <ModalComponent {...defaultProps} title="Test">
          <button>First Button</button>
          <button>Second Button</button>
        </ModalComponent>
      );

      // Wait for initial focus
      await waitFor(() => {
        const closeButton = screen.getByTestId('modal-close-button');
        expect(closeButton).toHaveFocus();
      }, { timeout: 200 });

      // Shift+Tab should go to last element
      await user.tab({ shift: true });
      expect(screen.getByText('Second Button')).toHaveFocus();

      await user.tab({ shift: true });
      expect(screen.getByText('First Button')).toHaveFocus();

      await user.tab({ shift: true });
      const closeButton = screen.getByTestId('modal-close-button');
      expect(closeButton).toHaveFocus();
    });
  });

  describe('Focus Restoration', () => {
    it('should restore focus to trigger element when modal closes', async () => {
      const TriggerButton = () => {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
          <>
            <button onClick={() => setIsOpen(true)}>Open Modal</button>
            <ModalComponent isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <button onClick={() => setIsOpen(false)}>Close</button>
            </ModalComponent>
          </>
        );
      };

      // Import React for the test component
      const React = await import('react');

      render(<TriggerButton />);

      const triggerButton = screen.getByText('Open Modal');
      fireEvent.click(triggerButton);

      // Modal should be open
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);

      // Wait for focus restoration
      await waitFor(() => {
        expect(triggerButton).toHaveFocus();
      });
    });
  });

  describe('Event Cleanup', () => {
    it('should remove event listeners when modal is closed', () => {
      const { rerender } = render(<ModalComponent {...defaultProps} />);

      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      // Close modal
      rerender(<ModalComponent {...defaultProps} isOpen={false} />);

      expect(removeEventListenerSpy).toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(<ModalComponent {...defaultProps} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalled();

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Header Rendering', () => {
    it('should show border when title exists', () => {
      render(<ModalComponent {...defaultProps} title="Test Title" />);

      const header = screen.getByTestId('modal-header');
      expect(header).toHaveClass('border-b', 'border-gray-200');
    });

    it('should not show border when title does not exist', () => {
      render(<ModalComponent {...defaultProps} />);

      const header = screen.getByTestId('modal-header');
      expect(header).not.toHaveClass('border-b');
    });

    it('should not render header when both title and close button are hidden', () => {
      render(<ModalComponent {...defaultProps} showCloseButton={false} />);

      expect(screen.queryByTestId('modal-header')).not.toBeInTheDocument();
    });
  });

  describe('Animation Classes', () => {
    it('should have animation classes', () => {
      render(<ModalComponent {...defaultProps} />);

      const container = screen.getByTestId('modal-container');
      const content = screen.getByTestId('modal-content');

      expect(container).toHaveClass('animate-fadeIn');
      expect(content).toHaveClass('animate-slideUp');
    });

    it('should have motion-reduce classes', () => {
      render(<ModalComponent {...defaultProps} />);

      const container = screen.getByTestId('modal-container');
      const content = screen.getByTestId('modal-content');
      const backdrop = screen.getByTestId('modal-backdrop');

      expect(container).toHaveClass('motion-reduce:animate-none');
      expect(content).toHaveClass('motion-reduce:animate-none');
      expect(backdrop).toHaveClass('motion-reduce:backdrop-blur-none');
      expect(backdrop).toHaveClass('motion-reduce:transition-none');
    });
  });

  describe('Children Rendering', () => {
    it('should render children in modal body', () => {
      render(
        <ModalComponent {...defaultProps}>
          <div data-testid="custom-content">Custom Content</div>
        </ModalComponent>
      );

      const body = screen.getByTestId('modal-body');
      const customContent = screen.getByTestId('custom-content');

      expect(body).toContainElement(customContent);
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <ModalComponent {...defaultProps}>
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <button type="submit">Submit</button>
          </form>
        </ModalComponent>
      );

      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });
});
