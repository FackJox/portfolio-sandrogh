# Testing Utilities

This document provides an overview of the enhanced testing utilities available in the Sandro Portfolio project.

## Standardized Test Templates

We use standardized templates for all component tests to ensure consistency and comprehensive test coverage:

- [Component Test Template](COMPONENT-TEST-TEMPLATE.md) - Our standardized template for all component tests

The template includes sections for:
- Basic rendering tests
- Prop variations tests  
- Event handling tests
- Accessibility tests with jest-axe
- Integration tests with parent/child components
- ForwardRef implementation tests

When creating new tests, start by making a copy of this template and adapting it to your specific component.

### Example Implementations

Check these examples of the template applied to real components:

- [Button Test Example](examples/Button.test.example.tsx) - Example test for a basic UI component
- [Input Test Example](examples/Input.test.example.tsx) - Example test for a form component

## Test Utilities Overview

Our testing utilities are designed to make component testing easier and more robust. They are located in `__tests__/utils/test-utils.tsx` and provide the following functionality:

### Core Render Functions

- `render`: An enhanced version of React Testing Library's render function that includes theme provider and custom providers
- `renderWithOTPContext`: Renders components within a mock OTP input context
- `renderWithForm`: Renders form components with React Hook Form context

### Tailwind Class Testing

- `hasClasses`: Checks if an element has all specified classes
- `hasAnyClass`: Checks if an element has any of the specified classes
- `compareClasses`: Compares rendered classes with expected classes
- `hasStateClasses`: Tests pseudo-state classes like hover and focus

### Radix UI Component Testing

- `createRadixTester`: Creates a tester for any Radix UI component
- `createDialogTester`: Specialized tester for Radix UI Dialog components
- `createPopoverTester`: Specialized tester for Radix UI Popover components with positioning and alignment testing

### Form Testing

- `createControlledInputTester`: Provides helpers for testing controlled form inputs
- `createMockFormData`: Generates mock form data based on Zod schema with robust validation

### Mock Data Generators

- `createMockUser`: Creates mock user data
- `createMockPost`: Creates mock post/article data
- `createMockProject`: Creates mock portfolio project data
- `createMockDates`: Creates a set of useful test dates

### DOM Helpers

- `mockWindowResize`: Mocks window resize events
- `mockNavigation`: Mocks navigation functions
- `setupUserEvent`: Sets up userEvent for interaction testing
- `customQueries`: Provides additional queries for finding elements

## Best Practices

1. **Use the custom render function** instead of the default React Testing Library render
2. **Test classes with helpers** rather than testing implementation details
3. **Group tests by functionality** using nested describe blocks
4. **Mock contexts when needed** instead of making components rely on actual context
5. **Use mock data generators** to avoid repetitive test setup
6. **Test Radix components** with the specialized testers
7. **Validate form inputs** using the form testing helpers

## Contributing New Test Utilities

When adding new test utilities:

1. Add the utility function to `test-utils.tsx`
2. Add comprehensive tests in `test-utils.test.tsx`
3. Update this documentation
4. Follow the existing patterns for consistency

## Common Testing Patterns

### Testing Components with State

```tsx
import { render, screen, setupUserEvent } from '@/__tests__/utils/test-utils';

test('component updates state on click', async () => {
  const user = setupUserEvent();
  render(<Counter />);
  
  await user.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### Testing Components with Forms

```tsx
import { render, createMockFormData } from '@/__tests__/utils/test-utils';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

test('form component validates input', () => {
  const mockData = createMockFormData(schema);
  // Use mockData for form testing...
});
```

### Testing Tailwind Classes

```tsx
import { render, hasClasses } from '@/__tests__/utils/test-utils';

test('component has correct classes', () => {
  const { getByRole } = render(<Button variant="primary" />);
  const button = getByRole('button');
  
  expect(hasClasses(button, 'bg-primary', 'text-white')).toBe(true);
});
```

## Full Documentation

For detailed documentation of all testing utilities, see:

- [Testing Utilities Documentation](utils/README.md) - Comprehensive documentation of all utilities
- [Tailwind Class Testing](utils/cn-utility.md) - Tailwind-specific utilities

## Component Test Documentation

The following components have detailed test documentation:

- [Dialog Component Testing](components/dialog.md) - Testing strategy for Dialog component
- [Popover Component Testing](components/popover.md) - Testing strategy for Popover component
- [Portfolio Page Testing](app/portfolio/README.md) - Testing strategy for the Portfolio page component with filtering, interactions, and responsive layout

These documents outline the specific test cases, challenges, and approaches used for testing each component.

## Contribution Guidelines

When adding new testing utilities:

1. Add proper TypeScript types and JSDoc comments
2. Include tests for the utility itself in `test-utils.test.tsx`
3. Update the documentation in `docs/testing/utils/README.md`
4. Ensure the utility follows established patterns 