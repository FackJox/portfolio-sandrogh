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
- [Input Component Testing](testing/components/input.md) - Complete testing of the Input component covering rendering, controlled input, disabled state, events, accessibility, and ref forwarding
- [Textarea Component Testing](testing/components/textarea.md) - Thorough testing of the Textarea component covering rendering, controlled/uncontrolled input, resizing behavior, accessibility, form integration, and character limitations
- [Select Component Testing](testing/components/select.md) - Testing of the Select component covering initial rendering, controlled behavior, accessibility, and testing challenges specific to Radix UI Select primitive
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
- `components/ui/overlay/` components (3.15% statements)
- Most UI component directories have 0% coverage

### Areas with Good Coverage
- `lib/utils.ts`: 100% coverage
- `components/ui/form/button.tsx`: 100% coverage
- `components/ui/form/checkbox.tsx`: 100% coverage
- `components/ui/form/input.tsx`: 100% coverage
- `components/ui/form/textarea.tsx`: 100% coverage
- `components/ui/form/select.tsx`: ~79% coverage (newly added)
- `components/ui/form/input-otp.tsx`: ~96% coverage
- `components/ui/theming/theme-provider.tsx`: 100% coverage
- `components/sections/Hero.tsx`: 100% coverage
- `components/sections/About.tsx`: 100% coverage
- `components/ui/form/form.tsx`: 95.45% with only 2 uncovered lines

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

## Critical Coverage Gaps

The following areas have the most critical coverage gaps:

### High Impact UI Components
1. **Form components** - These are fundamental building blocks used throughout the application:
   - `components/ui/form/form.tsx` (0%)

2. **Overlay components** - Essential for user interaction:
   - `components/ui/overlay/dialog.tsx` (0%)
   - `components/ui/overlay/popover.tsx` (0%)
   - `components/ui/overlay/dropdown-menu.tsx` (0%)

### Core Application Logic
1. **App Pages**:
   - `app/page.tsx` (0%)
   - `app/portfolio/page.tsx` (0%)

2. **Section Components**:
   - `components/sections/featured-work-carousel.tsx` (0%)
   - `components/sections/Testimonials.tsx` (0%)
   - `components/sections/Contact.tsx` (0%)

### Utilities and Hooks
- `hooks/use-toast.ts` (0%)
- `hooks/use-scroll-carousel.tsx` (0%)
- `hooks/use-mobile.tsx` (0%)

## Improvement Plan

### Phase 1: Core UI Components (Target: 20% overall coverage)
1. Create tests for most-used form components:
   - ✅ `select.tsx` - Test selection functionality, keyboard navigation, and accessibility
   - `form.tsx` - Test form validation, submission handling, and error display

2. Add tests for critical overlay components:
   - `dialog.tsx` - Test opening/closing, focus management, and accessibility
   - `popover.tsx` - Test triggering, positioning, and accessibility

### Phase 2: Application Pages and Sections (Target: 30% overall coverage)
1. Test main application pages:
   - `app/page.tsx` - Test rendering of main sections and layout structure
   - `app/portfolio/page.tsx` - Test portfolio item display and filtering

2. Test key section components:
   - `featured-work-carousel.tsx` - Test carousel navigation and item display
   - `Contact.tsx` - Test form submission and validation

### Phase 3: Hooks and Utilities (Target: 40% overall coverage)
1. Test custom hooks:
   - `use-toast.ts` - Test toast creation, dismissal, and styling
   - `use-scroll-carousel.tsx` - Test scroll behavior and item selection
   - `use-mobile.tsx` - Test viewport detection logic

### Testing Approach
1. Focus on behavioral testing rather than implementation details
2. Ensure accessibility testing is included in all UI component tests
3. Prioritize tests for components used in multiple places in the application
4. Use snapshot testing judiciously for stable UI components

## Conclusion
By following this phased approach, we can systematically improve test coverage across the codebase. The plan focuses on the most critical components first, gradually working toward the coverage thresholds of 40% for statements, 30% for branches, 40% for functions, and 40% for lines.

# Test Coverage Progress

## Implementation Progress

| Date | Component/Module | Tests Added | Coverage Increase |
|------|-----------------|-------------|-------------------|
| Current | Initial Coverage | - | 6.29% statements, 7.16% branches, 5.76% functions, 6.22% lines |
| Previous | `components/ui/form/textarea.tsx` | 27 tests | +0.43% statements, +0% branches, +0.65% functions, +0.45% lines |
| Latest | `components/ui/form/select.tsx` | 7 tests | +0.74% statements, +0.30% branches, +0.65% functions, +0.67% lines |

## Recently Added Tests

### Select Component

A test suite was implemented for the `select.tsx` component including:

- **Initial Rendering tests**: Validating proper rendering with default props, closed dropdown state, custom className, and correct styling
- **Controlled Behavior tests**: Testing value prop updates and onValueChange handling
- **Accessibility tests**: Verifying ARIA attributes for dropdown accessibility

The implementation focuses on reliable verification of core functionality rather than attempting to test all aspects of the complex Radix UI Select primitive. This approach prioritizes tests that can be reliably executed in JSDOM while acknowledging the challenges of testing portal-rendered content and complex user interactions.

The test implementation achieves approximately 79% line coverage of the Select component, focusing on the most critical functionality while avoiding brittle tests dependent on implementation details.

### Textarea Component

A comprehensive test suite was implemented for the `textarea.tsx` component including:

- **Rendering tests**: Validating proper rendering with default props, custom className, placeholder text, and class merging
- **Controlled vs Uncontrolled tests**: Testing defaultValue behavior, controlled state updates, and proper value handling
- **Resizing behavior tests**: Verifying resize attribute support and minimum height application
- **Accessibility tests**: Checking ARIA attributes, focus management, and axe violations
- **Form integration tests**: Testing integration with forms, validation behaviors and required attributes
- **Character count and limitations tests**: Testing maxLength behavior and character count display
- **Placeholder behavior tests**: Verifying placeholder display in different states
- **ForwardRef tests**: Validating proper ref forwarding to the underlying textarea element

This implementation follows the test template pattern established in `docs/testing/TEST-TEMPLATE.md` and serves as a model for future component test implementations.

## Next Steps

1. Implement tests for `form.tsx` component, which is a critical form component with 0% coverage
2. ✅ Implement tests for `select.tsx` component, which has complex functionality
3. Continue with implementation of the test plan as outlined in `docs/testing/COVERAGE-PLAN.md`