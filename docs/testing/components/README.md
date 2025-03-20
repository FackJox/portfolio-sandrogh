# Component Testing Documentation

This directory contains detailed documentation for each component's test suite in the Sandro Portfolio project.

## UI Components

### Form Components
- [Button](./button.md) - Implementation of the Button component tests
- [Checkbox](./checkbox.md) - Implementation of the Checkbox component tests
- [Input](./input.md) - Implementation of the Input component tests
- [Textarea](./textarea.md) - Implementation of the Textarea component tests
- [Select](./select.md) - Implementation of the Select component tests
- [Form](./form.md) - Implementation of the Form component tests

### Overlay Components
- [Dialog](./dialog.md) - Implementation of the Dialog component tests
- [Dropdown Menu](./dropdown-menu.md) - Implementation of the Dropdown Menu component tests
- [Popover](./popover.md) - Implementation of the Popover component tests

### Feedback Components
- [Toast](./toast.md) - Implementation of the Toast component tests

## Layout Components
- [Header](./header.md) - Implementation of the Header component tests

## Section Components
- [Hero](./hero.md) - Implementation of the Hero section component tests
- [About](./about.md) - Implementation of the About section component tests
- [Featured Work Carousel](./featured-work-carousel.md) - Implementation of the Featured Work Carousel component tests

## Testing Patterns

This section outlines common patterns used across component tests.

### Component Render Testing

All components should test their rendering behavior:

```typescript
describe("Rendering", () => {
  it("renders correctly with default props", () => {
    render(<Component />);
    // Assertions about the rendered output
  });
});
```

### State Management Testing

For components with internal state:

```typescript
describe("State Management", () => {
  it("updates state when interacted with", async () => {
    const user = userEvent.setup();
    render(<Component />);
    
    // Interact with the component
    await user.click(screen.getByRole("button"));
    
    // Verify state change
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "active");
  });
});
```

### User Interaction Testing

For interactive components:

```typescript
describe("User Interaction", () => {
  it("calls the onClick handler when clicked", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Component onClick={handleClick} />);
    
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Accessibility Testing

All components should test accessibility:

```typescript
describe("Accessibility", () => {
  it("has the correct ARIA attributes", () => {
    render(<Component aria-label="Test Label" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Test Label");
  });
  
  it("can be navigated with keyboard", async () => {
    const user = userEvent.setup();
    render(<Component />);
    
    // Tab to focus the component
    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    
    // Activate with keyboard
    await user.keyboard("{enter}");
    // Verify activation behavior
  });
});
```

### Styling and Variants

For components with style variants:

```typescript
describe("Styling", () => {
  it("applies the correct classes for each variant", () => {
    render(<Component variant="primary" />);
    expect(screen.getByRole("button")).toHaveClass("bg-primary text-white");
    
    cleanup();
    
    render(<Component variant="secondary" />);
    expect(screen.getByRole("button")).toHaveClass("bg-secondary text-black");
  });
});
```

### Testing Composition

For compound components:

```typescript
describe("Composition", () => {
  it("correctly composes with other components", () => {
    render(
      <Component>
        <Component.Item>Item 1</Component.Item>
        <Component.Item>Item 2</Component.Item>
      </Component>
    );
    
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});
```

## Common Testing Utilities

### Custom Render Function

Many tests use a custom render function from `__tests__/utils/test-utils.tsx` that provides additional context:

```typescript
import { render } from '@/__tests__/utils/test-utils';

// In the test:
render(<Component />, { 
  theme: "dark",
  withTooltipProvider: true 
});
```

### Class Testing Utilities

For testing Tailwind classes:

```typescript
import { hasClasses, compareClasses } from '@/__tests__/utils/test-utils';

// In the test:
const element = screen.getByRole("button");
expect(hasClasses(element, "bg-primary", "text-white")).toBe(true);
```

### Mock Implementations

Common mocks for complex components:

```typescript
// Mock Next.js components
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} data-testid="mock-image" />
}));
```

## Directory Structure

Tests are organized following the same structure as the component files:

```
__tests__/
  components/
    ui/
      form/
        button.test.tsx
        checkbox.test.tsx
      overlay/
        dialog.test.tsx
    sections/
      hero.test.tsx
```

This makes it easy to find tests for a specific component and maintain consistency.

## Testing Challenges

### Testing Radix UI Components

Radix UI components present challenges with their portal-based rendering and context providers. See specific component documentation for strategies.

### Testing NextJS Components

Next.js components often require specific mocks for features like routing and image optimization. Common patterns are documented in individual component files.

### Testing Responsive Components

Testing responsive behavior requires simulating different viewport sizes. See specific component documentation for examples of testing responsive designs.

## Further Reading

For more detailed information about testing practices, see:
- [Component Testing Guidelines](../COMPONENT-TESTING.md)
- [Testing Strategy](../TESTING-STRATEGY.md)
- [Integration Testing](../INTEGRATION-TESTING.md)

## Component Test Coverage

Current component test coverage:

| Component | Lines | Statements | Branches | Functions |
|-----------|-------|------------|----------|-----------|
| Button    | 100%  | 100%       | 100%     | 100%      |
| Checkbox  | 100%  | 100%       | 100%     | 100%      |
| Input     | 100%  | 100%       | 100%     | 100%      |
| Textarea  | 100%  | 100%       | 100%     | 100%      |
| Select    | 79%   | 81%        | 75%      | 80%       |
| Form      | 95%   | 94%        | 93%      | 96%       |
| Dialog    | 92%   | 92%        | 100%     | 100%      |
| Toast     | 87%   | 85%        | 80%      | 90%       |
| Header    | 100%  | 100%       | 100%     | 100%      |
| Hero      | 100%  | 100%       | 100%     | 100%      |
| About     | 100%  | 100%       | 100%     | 100%      |
| Featured Work Carousel | 100% | 100% | 100% | 100% | 