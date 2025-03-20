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

Special patterns for testing specific component types:

1. **Radix UI Components** - Use the `createRadixTester` utility and custom render function with context providers. See [Testing Radix UI Components](testing/COMPONENT-TESTING.md#testing-radix-ui-components-with-proper-context)
2. **Components with forwardRef** - Test ref forwarding with both default elements and when using `asChild`. See [Testing Components with forwardRef](testing/COMPONENT-TESTING.md#testing-components-with-forwardref)
3. **Components with cva Variants** - Test each variant combination systematically using the `hasClasses` utility. See [Testing Components with Multiple Variants](testing/COMPONENT-TESTING.md#testing-components-with-multiple-variants-cva)
4. **Responsive Components** - Use `mockWindowResize` to test at different viewport sizes. See [Testing Responsive Behaviors](testing/COMPONENT-TESTING.md#testing-responsive-behaviors)
5. **Accessibility Features** - Test ARIA attributes, keyboard navigation, and focus management. See [Testing Accessibility Features](testing/COMPONENT-TESTING.md#testing-accessibility-features)

### UI Component Test Documentation

- [Button Component Testing](testing/components/button.md) - Comprehensive testing of the Button component including variants, sizes, loading states, disabled state behavior, keyboard interaction, focus styles, accessibility features, event handlers, and rendering as different HTML elements
- [Checkbox Component Testing](testing/components/checkbox.md) - Complete testing of the Checkbox component covering rendering, state management, keyboard interactions, accessibility, and form integration
- [Dialog Component Testing](testing/components/dialog.md) - Complete testing of the Dialog component covering rendering, opening/closing behavior, keyboard interactions, focus management, accessibility, form integration, and portal rendering
- [Dropdown Menu Component Testing](testing/components/dropdown-menu.md) - Comprehensive testing of the Dropdown Menu component covering rendering, opening/closing, menu item selection, keyboard navigation, submenu functionality, disabled items, custom rendering, and accessibility features
- [Input Component Testing](testing/components/input.md) - Complete testing of the Input component covering rendering, controlled input, disabled state, events, accessibility, and ref forwarding
- [Textarea Component Testing](testing/components/textarea.md) - Thorough testing of the Textarea component covering rendering, controlled/uncontrolled input, resizing behavior, accessibility, form integration, and character limitations
- [Select Component Testing](testing/components/select.md) - Testing of the Select component covering initial rendering, controlled behavior, accessibility, and testing challenges specific to Radix UI Select primitive
- [Toast Component Testing](testing/components/toast.md) - Comprehensive testing of the Toast notification system covering toast component, toaster queue management, animations, accessibility, and useToast hook
- [Form Component Testing](testing/components/form.md) - Comprehensive testing of the Form component orchestrating form state management, validation, submission, reset functionality, accessibility, and integration with other form components
- [Header Component Testing](testing/components/header.md) - Testing of the Header layout component including navigation links, responsive behavior, mobile menu, and accessibility
- [Hero Component Testing](testing/components/hero.md) - Testing of the Hero section component including headline text, subheadline, CTA buttons, image rendering, responsive layout, and accessibility
- [About Component Testing](testing/components/about.md) - Testing of the About section component including section title, biography text, portrait image, client logo grid, responsive layout, and accessibility

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
- 7.03% Statements (up from 5.25%)
- 7.46% Branches (up from 7.16%)
- 6.41% Functions (up from 3.20%)
- 6.89% Lines (up from 5.14%)

Coverage reports are generated automatically when running tests.

### Areas Needing Immediate Attention
- `app/` directory components (0% coverage)
- `components/sections/` components (0% coverage)
- `hooks/` directory (0% coverage)
- Most UI component directories have 0% coverage

### Areas with Good Coverage
- `lib/utils.ts`: 100% coverage
- `components/ui/form/button.tsx`: 100% coverage
- `components/ui/form/checkbox.tsx`: 100% coverage
- `components/ui/form/input.tsx`: 100% coverage
- `components/ui/form/textarea.tsx`: 100% coverage
- `components/ui/form/select.tsx`: ~79% coverage
- `components/ui/form/input-otp.tsx`: ~96% coverage
- `components/ui/theming/theme-provider.tsx`: 100% coverage
- `components/sections/Hero.tsx`: 100% coverage
- `components/sections/About.tsx`: 100% coverage
- `components/ui/form/form.tsx`: 95.45% with only 2 uncovered lines
- `components/ui/overlay/dialog.tsx`: 91.66% lines
- `components/ui/overlay/dropdown-menu.tsx`: 100% coverage

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

# Test Coverage Analysis and Improvement Plan

## Current Coverage Status

As of the latest test run, the project has the following coverage metrics:
- **Statements**: 7.03% (Target: 40%)
- **Branches**: 7.46% (Target: 30%)
- **Functions**: 6.41% (Target: 40%)
- **Lines**: 6.89% (Target: 40%)

## Well-Tested Components

The following components have excellent test coverage (100%):
- `lib/utils.ts`
- `components/ui/form/button.tsx` (100% across all metrics)
- `components/layout/Header.tsx`
- `components/sections/Hero.tsx`
- `components/sections/About.tsx`
- `components/ui/form/checkbox.tsx`
- `components/ui/form/form.tsx` (95.45% with only 2 uncovered lines)
- `components/ui/form/input.tsx` (100% on all metrics)
- `components/ui/form/textarea.tsx` (100% on all metrics)
- `components/ui/form/input-otp.tsx` (95.83% lines)
- `components/ui/form/select.tsx` (79.16% lines)
- `components/ui/overlay/dialog.tsx` (91.66% lines)
- `components/ui/overlay/dropdown-menu.tsx` (100% coverage)