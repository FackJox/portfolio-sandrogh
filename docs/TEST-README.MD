# Testing Documentation

This document serves as an index for all testing-related documentation in the Sandro Portfolio project.

## Test Utilities

- [Test Utilities Documentation](__tests__/utils/TEST-README.MD) - General documentation for test utilities
- [Testing Utilities](testing/utils/README.md) - In-depth documentation for test helper functions
- [cn() Utility Function Tests](testing/utils/cn-utility.md) - Documentation for the cn utility function tests and theme-related test fixes

## Testing Practices

### Component Testing

When testing UI components, follow these guidelines:

1. Use the custom render function from `__tests__/utils/test-utils.tsx` instead of the default one from React Testing Library
2. Test components in isolation, mocking any dependencies or contexts as needed
3. Test both the appearance and behavior of components
4. Use the Tailwind class testing helpers when testing styling

For comprehensive component testing guidelines, see [Component Testing Documentation](testing/COMPONENT-TESTING.md).

### UI Component Test Documentation

- [Button Component Testing](testing/components/button.md) - Comprehensive testing of the Button component including variants, sizes, events, accessibility, and ref forwarding
- [Input Component Testing](testing/components/input.md) - Complete testing of the Input component covering rendering, controlled input, disabled state, events, accessibility, and ref forwarding
- [Header Component Testing](testing/components/header.md) - Testing of the Header layout component including navigation links, responsive behavior, mobile menu, and accessibility

### Integration Testing

For testing how components interact with each other, refer to [Integration Testing Documentation](testing/INTEGRATION-TESTING.md).

### End-to-End Testing

For future E2E testing plans and implementation details, see [E2E Testing Documentation](testing/E2E-TESTING.md).

### Test Organization

- Place test files next to the files they test with a `.test.tsx` or `.spec.tsx` extension
- Use descriptive test names that explain what is being tested
- Group related tests with `describe` blocks
- Use `beforeEach` for common setup code

### Example Test Structure

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import { Button } from '@/components/ui/form/button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click Me');
    });
  });

  describe('Variants', () => {
    it('applies the correct classes for primary variant', () => {
      // Test implementation
    });
  });

  describe('Behavior', () => {
    it('calls onClick handler when clicked', () => {
      // Test implementation
    });
  });
});
```

## Testing Specific Component Types

### Radix UI Components

- Use the custom render function which includes any necessary providers
- Test that ARIA attributes are correctly applied
- Test keyboard navigation where applicable
- Use the hasClasses utility to verify styling based on state changes

### Testing Form Components

- Test both controlled and uncontrolled usage
- Verify validation behavior
- Test form submission
- Verify accessibility attributes

### OTP Input Components

- Use the OTP context mock utilities provided in `__tests__/utils/test-utils.tsx`
- Test different states (empty, filled, active, with caret)
- For InputOTPSlot, test validation scenarios:
  - Normal rendering with valid index values
  - Handling of out-of-bounds indices
  - Proper fallback behavior when context is missing
  - Development mode console warnings for invalid inputs

## Additional Resources

- [Component Testing](testing/components/README.md) - Documentation for testing specific components
- [Testing Strategy](./testing/TESTING-STRATEGY.md) - Comprehensive testing approach and implementation plan

## Setup

The project uses the following testing tools:

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **Testing Library User Event**: Simulates user interactions

## Running Tests

To run the tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Test Structure

Tests are organized by component or feature and follow these conventions:

- Test files are located next to the components they test
- Test files are named `[component-name].test.tsx`
- Each test file focuses on a single component or feature

## Test Coverage

The project aims for the following code coverage targets:

### Current Coverage Thresholds
- 20% Statements
- 15% Branches
- 20% Functions
- 20% Lines

### Final Coverage Goals
- 80% Statements
- 70% Branches
- 90% Functions
- 80% Lines

Current coverage status (as of latest run):
- 5.25% Statements (up from 4.82%)
- 7.16% Branches (unchanged)
- 3.20% Functions (up from 2.56%)
- 5.14% Lines (up from 4.69%)

Coverage reports are generated automatically when running tests.

### Areas Needing Immediate Attention
- `app/` directory components (0% coverage)
- `components/sections/` components (0% coverage)
- `hooks/` directory (0% coverage)
- `components/ui/overlay/` components (3.15% statements)
- Most UI component directories have 0% coverage

### Areas with Good Coverage
- `lib/utils.ts`: 100% coverage
- `components/ui/form/button.tsx`: 100% coverage
- `components/ui/form/checkbox.tsx`: 100% coverage
- `components/ui/form/input.tsx`: 100% coverage
- `components/ui/form/input-otp.tsx`: ~96% coverage
- `components/ui/theming/theme-provider.tsx`: 100% coverage

For detailed coverage analysis and improvement plans, see the [Coverage Progress](./testing/COVERAGE-PROGRESS.md) document.

For more details on the overall testing strategy, refer to the [Testing Strategy](./testing/TESTING-STRATEGY.md) document.

## Jest Configuration

The project uses a custom Jest configuration with the following features:

- **Coverage Thresholds**: Initial baseline of 10% across all metrics
- **Verbose Output**: Detailed reporting of test results
- **Module Directories**: Includes node_modules and root directory
- **Test Matching**: Consistent patterns for test discovery
  - `**/__tests__/**/*.test.[jt]s?(x)`
  - `**/?(*.)+(spec|test).[jt]s?(x)`
- **Coverage Collection**: Automatic for specified directories

For more details, refer to the [Testing Strategy](./testing/TESTING-STRATEGY.md) document.

## Writing Tests

When writing tests, follow these principles:

1. Test behavior, not implementation
2. Prefer user-centric queries (e.g., `getByRole`, `getByLabelText`) over implementation details
3. Mock external dependencies and API calls
4. Test edge cases and error scenarios

## Documentation Sections

- [Component Tests](./testing/components/README.md) - Tests for UI components
- [Component Testing Guidelines](./testing/COMPONENT-TESTING.md) - Guidelines for testing UI components
- [Integration Testing](./testing/INTEGRATION-TESTING.md) - Approach for testing component interactions
- [E2E Testing](./testing/E2E-TESTING.md) - End-to-end testing documentation 