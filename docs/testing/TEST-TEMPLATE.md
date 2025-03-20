# Component Test Template

This template provides a consistent structure for component tests in the Sandro Portfolio project.

## Basic Structure

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { ComponentName } from '@/components/path/to/component'

describe('ComponentName', () => {
  // Rendering Tests
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ComponentName />)
      // Assertions
    })

    it('renders with custom className', () => {
      render(<ComponentName className="custom-class" />)
      // Assertions
    })

    // Additional rendering tests as needed
  })

  // Behavior Tests
  describe('Behavior', () => {
    it('handles user interaction correctly', async () => {
      const user = userEvent.setup()
      render(<ComponentName />)
      
      // Interact with the component
      await user.click(screen.getByRole('button'))
      
      // Assertions
    })

    // Additional behavior tests as needed
  })

  // Accessibility Tests
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ComponentName />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has the correct ARIA attributes', () => {
      render(<ComponentName />)
      // Assertions for ARIA attributes
    })

    // Additional accessibility tests as needed
  })

  // Form Integration Tests (if applicable)
  describe('Form Integration', () => {
    it('integrates with form submission', async () => {
      const handleSubmit = jest.fn()
      const user = userEvent.setup()
      
      // Render with form
      
      // Interact and submit
      
      // Assertions
    })

    // Additional form tests as needed
  })

  // ForwardRef Implementation Tests (if applicable)
  describe('ForwardRef Implementation', () => {
    it('forwards ref to the appropriate element', () => {
      const ref = { current: null }
      render(<ComponentName ref={ref} />)
      expect(ref.current).not.toBeNull()
      // Additional assertions
    })

    // Additional ref tests as needed
  })
})
```

## Testing Different Component Types

### UI Components

Focus on:
- Rendering with different variants and sizes
- Styling classes application
- User interactions
- Keyboard accessibility
- ARIA attributes

### Form Components

Focus on:
- Controlled vs. uncontrolled behavior
- Form submission
- Validation
- Error states
- Disabled states

### Page Components

Focus on:
- Rendering of key sections
- Data fetching (mocked)
- User flows
- Responsive layout (with window resize mocks)

## Common Test Utilities

```tsx
// Import test utilities
import { 
  render, 
  hasClasses, 
  hasAnyClass, 
  compareClasses 
} from '@/__tests__/utils/test-utils'

// Example of using test utilities
it('applies variant classes correctly', () => {
  const { getByRole } = render(<Button variant="primary" />)
  const button = getByRole('button')
  expect(hasClasses(button, ['bg-primary', 'text-white'])).toBe(true)
})
```

## Mocking Context Providers

When testing components that rely on context:

```tsx
import { renderWithOTPContext } from '@/__tests__/utils/test-utils'

it('renders with context provider', () => {
  const { getByRole } = renderWithOTPContext(<ComponentWithContext />)
  // Assertions
})
```

## Testing Responsive Components

```tsx
import { resizeWindow } from '@/__tests__/utils/test-utils'

it('adapts to mobile screens', () => {
  // Resize to mobile viewport
  resizeWindow(375, 667)
  
  render(<ResponsiveComponent />)
  
  // Assertions for mobile layout
  
  // Reset window size
  resizeWindow(1024, 768)
})
``` 