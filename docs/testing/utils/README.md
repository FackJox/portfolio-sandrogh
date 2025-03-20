# Testing Utilities Documentation

This document provides detailed information about the testing utilities available in the Sandro Portfolio project. These utilities are designed to make testing components easier, more consistent, and more efficient.

## Core Render Function

The core `render` function in `__tests__/utils/test-utils.tsx` enhances React Testing Library's standard render function by adding support for providers and context.

```tsx
import { render } from '@/__tests__/utils/test-utils';

// Basic usage
const { getByText } = render(<MyComponent />);

// With theme and route
const { getByText } = render(<MyComponent />, {
  theme: 'dark',
  route: '/dashboard',
  withTooltipProvider: true
});

// With custom providers
const { getByText } = render(<MyComponent />, {
  withProviders: [
    { Provider: ThemeProvider, props: { theme: 'dark' } },
    { Provider: AuthProvider, props: { user: mockUser } }
  ]
});
```

The render function automatically handles:
- Theme provider setup with the specified theme
- Route setting using window.history
- Tooltip provider when needed
- Additional custom providers as required

## Tailwind Class Testing Utilities

### hasClasses

Tests if an element has all the specified Tailwind classes.

```tsx
import { render, hasClasses } from '@/__tests__/utils/test-utils';

test('button has correct classes', () => {
  const { getByRole } = render(<Button variant="primary" />);
  const button = getByRole('button');
  
  expect(hasClasses(button, 'bg-primary', 'text-white')).toBe(true);
});
```

### hasAnyClass

Tests if an element has any of the specified Tailwind classes.

```tsx
import { render, hasAnyClass } from '@/__tests__/utils/test-utils';

test('button has at least one variant class', () => {
  const { getByRole } = render(<Button variant="primary" />);
  const button = getByRole('button');
  
  expect(hasAnyClass(button, 'bg-primary', 'bg-secondary')).toBe(true);
});
```

### compareClasses

Compares rendered classes with expected classes, useful for testing class-variance-authority (cva) output.

```tsx
import { compareClasses } from '@/__tests__/utils/test-utils';

test('component has exactly the expected classes', () => {
  const receivedClasses = 'bg-primary text-white p-4';
  expect(compareClasses(receivedClasses, ['bg-primary', 'text-white', 'p-4'])).toBe(true);
});
```

### hasStateClasses

Tests pseudo-state classes like hover, focus, and active states.

```tsx
import { render, hasStateClasses } from '@/__tests__/utils/test-utils';

test('button has correct hover state classes', async () => {
  const { getByRole } = render(<Button variant="primary" />);
  const button = getByRole('button');
  
  const hoverTest = hasStateClasses(button, 'hover', 'bg-primary-600', 'shadow-md');
  await expect(hoverTest()).resolves.toBe(true);
  
  const focusTest = hasStateClasses(button, 'focus', 'ring-2', 'ring-primary-500');
  await expect(focusTest()).resolves.toBe(true);
});
```

## Data Attribute Testing

### hasDataAttribute

Tests if an element has a data attribute with an optional specific value.

```tsx
import { render, hasDataAttribute } from '@/__tests__/utils/test-utils';

test('dialog has correct state', () => {
  const { getByRole } = render(<Dialog open />);
  const dialog = getByRole('dialog');
  
  expect(hasDataAttribute(dialog, 'state', 'open')).toBe(true);
});
```

## Radix UI Component Testing

### createRadixTester

Provides a tester for Radix UI components with open/close states.

```tsx
import { render, createRadixTester } from '@/__tests__/utils/test-utils';

test('dialog opens and closes correctly', async () => {
  const { container } = render(<Dialog />);
  
  const dialogTester = createRadixTester(
    { container }, // RenderResult
    '[data-test-id="dialog-trigger"]', // trigger selector
    '[role="dialog"]', // content selector
    'open', // open state value (default: 'open')
    'closed' // closed state value (default: 'closed')
  );
  
  expect(dialogTester.isOpen()).toBe(false);
  
  await dialogTester.open();
  expect(dialogTester.isOpen()).toBe(true);
  
  await dialogTester.close();
  expect(dialogTester.isOpen()).toBe(false);
});
```

### createDialogTester

Enhanced tester specifically for dialog/modal components that includes testing escape key and outside clicks.

```tsx
import { render, createDialogTester } from '@/__tests__/utils/test-utils';

test('dialog can be closed with escape key', async () => {
  const { container } = render(<Dialog />);
  
  const dialogTester = createDialogTester(
    { container },
    '[data-test-id="dialog-trigger"]',
    '[role="dialog"]'
  );
  
  await dialogTester.open();
  expect(dialogTester.isOpen()).toBe(true);
  
  await dialogTester.closeWithEscape();
  expect(dialogTester.isOpen()).toBe(false);
  
  // Or test outside click closing
  await dialogTester.open();
  await dialogTester.closeWithOutsideClick();
  expect(dialogTester.isOpen()).toBe(false);
});
```

## Form Testing Utilities

### renderWithForm

Renders a component within a React Hook Form context.

```tsx
import { renderWithForm } from '@/__tests__/utils/test-utils';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

test('form component renders with react-hook-form', () => {
  const { getByRole } = renderWithForm(
    <MyFormComponent />,
    {
      schema,
      defaultValues: {
        email: 'test@example.com',
        password: 'password123'
      }
    }
  );
  
  // Test the component with form context provided
});
```

### createControlledInputTester

Helper for testing form input components in controlled mode.

```tsx
import { createControlledInputTester } from '@/__tests__/utils/test-utils';

test('input component works in controlled mode', () => {
  const inputTester = createControlledInputTester(
    <Input placeholder="Email" />,
    {
      initialValue: 'test@example.com',
      newValue: 'updated@example.com'
    }
  );
  
  // Render as controlled input
  const { getByPlaceholderText } = inputTester.renderControlled();
  const input = getByPlaceholderText('Email');
  expect(input.value).toBe('test@example.com');
  
  // Render as invalid input
  const { getByPlaceholderText: getInvalid } = inputTester.renderInvalid();
  const invalidInput = getInvalid('Email');
  expect(invalidInput).toHaveAttribute('aria-invalid', 'true');
  
  // Render within a form
  const { input: formInput, submitButton } = inputTester.renderWithForm();
  // Now you can test form submission
});
```

## Mock Data Generators

These utilities help create mock data for testing:

#### `createMockUser(overrides?: Partial<MockUser>): MockUser`

Generates mock user data for testing with sensible defaults. Accepts optional overrides for customization.

```typescript
const user = createMockUser({ name: 'Custom Name' });
// => { id: 'user-1234', name: 'Custom Name', email: 'test@example.com', ... }
```

#### `createMockPost(overrides?: Partial<MockPost>): MockPost`

Generates mock blog post data for testing with sensible defaults. Accepts optional overrides for customization.

```typescript
const post = createMockPost({ title: 'Custom Title' });
// => { id: 'post-1234', title: 'Custom Title', content: '...', ... }
```

#### `createMockProject(overrides?: Partial<MockProject>): MockProject`

Generates mock portfolio project data for testing with sensible defaults. Accepts optional overrides for customization.

```typescript
const project = createMockProject({ featured: true });
// => { id: 'project-1234', title: 'Portfolio Project', featured: true, ... }
```

#### `createMockFormData<T extends z.ZodType>(schema: T, overrides?: Partial<z.infer<T>>): z.infer<T>`

Generates mock form data that validates against a Zod schema. Provides type-safe defaults based on schema fields and their types.

Features:
- Intelligently handles Zod schema types (strings, numbers, booleans, dates, arrays)
- Provides sensible defaults based on field names (email, password, name, etc.)
- Applies custom overrides to generated data
- Validates data against schema before returning it
- Special handling for common test cases

```typescript
// Define a schema for form validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// Generate mock data that validates against the schema
const mockLoginData = createMockFormData(loginSchema);
// => { email: 'test@example.com', password: 'Password123!' }

// With overrides
const customData = createMockFormData(loginSchema, { email: 'custom@example.com' });
// => { email: 'custom@example.com', password: 'Password123!' }
```

#### `createMockDates(): MockDates`

Generates a set of dates useful for testing date-related components and functions.

```typescript
const dates = createMockDates();
// => { 
//   now: Date,
//   yesterday: Date,
//   tomorrow: Date,
//   nextWeek: Date,
//   lastMonth: Date,
//   iso: { now: string, yesterday: string, ... },
//   formatted: { now: "YYYY-MM-DD", ... }
// }
``` 