# Testing Strategy

## Overview

This document outlines the testing strategy for the Sandro Portfolio project, establishing standards and approaches for ensuring code quality through comprehensive testing.

## Current State

As of the latest assessment, the project has:

- Testing infrastructure in place (Jest + React Testing Library)
- Test utility functions for common testing scenarios
- Documentation for intended testing patterns
- Very limited test implementation (~3.5% statement coverage)

## Guiding Principles

Our testing approach follows these core principles:

1. **Behavior over Implementation**: Test what components do, not how they're built
2. **User-Centric**: Prioritize tests that reflect user interactions
3. **Maintainability**: Tests should be easy to understand and maintain
4. **Coverage-Guided**: Use coverage metrics to identify testing gaps

## Test Types

### Unit Tests

- **Purpose**: Verify individual components function correctly in isolation
- **Target**: UI components, utility functions, hooks
- **Tools**: Jest, React Testing Library
- **Location**: Co-located with components (`*.test.tsx`)

### Integration Tests

- **Purpose**: Verify components work together correctly
- **Target**: Component compositions, page layouts, data flow
- **Tools**: Jest, React Testing Library
- **Location**: `__tests__/integration` directory

### End-to-End Tests

- **Purpose**: Verify complete user flows
- **Target**: Critical user journeys, form submissions
- **Tools**: Cypress (planned)
- **Location**: `cypress/e2e` directory (to be created)

## Component Testing Strategy

### UI Components

All UI components should have tests that:

1. Verify correct rendering in all variant states
2. Confirm proper handling of props
3. Test user interactions (clicks, inputs, etc.)
4. Verify accessibility features

### Example Structure

```typescript
// button.test.tsx
describe("Button Component", () => {
  // Basic rendering
  it("renders correctly with default props", () => {})
  
  // Variants
  it("applies the correct styles for primary variant", () => {})
  it("applies the correct styles for secondary variant", () => {})
  
  // Interactions
  it("calls onClick handler when clicked", () => {})
  
  // Accessibility
  it("has appropriate ARIA attributes", () => {})
})
```

### Radix UI Components

For Radix-based components, tests should:

1. Verify proper context integration
2. Test controlled vs. uncontrolled behavior
3. Confirm accessibility features are preserved
4. Verify proper composition patterns

## Section/Page Testing

Pages and sections should have integration tests that:

1. Verify correct component composition
2. Test data flow between components
3. Confirm responsive behavior

## Coverage Goals and Timeline

| Phase | Statement Coverage | Function Coverage | Branch Coverage | Line Coverage |
|-------|-------------------|------------------|----------------|---------------|
| Initial | 10%             | 10%              | 10%            | 10%           |
| Current | 20%             | 20%              | 15%            | 20%           |
| Final | 80%               | 90%              | 70%            | 80%           |

### Current Coverage Status

As of the latest test run, the project has:
- 4.82% Statement coverage (target: 20%)
- 7.16% Branch coverage (target: 15%)
- 2.56% Function coverage (target: 20%)
- 4.69% Line coverage (target: 20%)

### Priority Areas for Coverage Improvement

1. **High Priority** (Most Impact on Coverage):
   - `app/` directory components (layout.tsx, page.tsx)
   - `components/sections/` components (Hero, About, Contact, etc.)
   - `hooks/` directory (use-mobile.tsx, use-scroll-carousel.tsx)

2. **Medium Priority**:
   - `components/ui/overlay/` components (alert-dialog, dialog, etc.)
   - `components/ui/data-display/` components (accordion, avatar, badge, etc.)
   - `components/ui/feedback/` components (alert, progress, toast, etc.)

3. **Lower Priority**:
   - `components/ui/layout/` components
   - `components/ui/media/` components
   - `components/ui/navigation/` components

## Current Configuration

The project's Jest configuration has been updated with:

- Coverage threshold of 20% for statements, 15% for branches, 20% for functions, and 20% for lines
- This establishes a meaningful baseline that requires intentional test coverage
- Verbose output for more detailed test information
- Consistent test matching patterns for both `__tests__/**/*.test.[jt]s?(x)` and `**/?(*.)+(spec|test).[jt]s?(x)`
- Module directories including node_modules and the root directory
- Automatic coverage collection and reporting

This configuration establishes meaningful but achievable standards that will be gradually increased as more tests are written.

## Implementation Priorities

1. **Core UI Components**: Button, Input, Card, etc.
2. **Layout Components**: Header, Footer, etc.
3. **Section Components**: Hero, About, Contact, etc.
4. **Page Compositions**: Homepage, etc.
5. **Utilities and Hooks**

## Testing Best Practices

### Do's

- Use role-based selectors (`getByRole`) over test IDs when possible
- Test component behavior, not implementation details
- Write descriptive test names that explain the expected behavior
- Mock external dependencies consistently
- Keep tests simple and focused on one behavior

### Don'ts

- Don't test third-party libraries (e.g., Radix UI internals)
- Avoid brittle selectors that break with minor UI changes
- Don't duplicate test coverage unnecessarily
- Avoid testing the same behavior multiple times

## Test Utilities

The project includes custom test utilities in `__tests__/utils/test-utils.tsx`:

- `render()`: Enhanced RTL render with providers
- `hasClasses()`: Verify Tailwind classes
- `hasAnyClass()`: Check for presence of any of the specified classes
- `compareClasses()`: Compare rendered vs expected classes
- `createMockOTPContext()`: Create mock contexts for testing

## CI/CD Integration

Testing is integrated into the CI/CD pipeline:

1. **Pull Requests**: All tests must pass
2. **Coverage Reports**: Generated on each build
3. **Coverage Thresholds**: To be gradually increased according to the timeline

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)
- [Component Testing Guide](./components/README.md) 