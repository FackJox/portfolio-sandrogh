# Integration Testing

This document outlines approaches for testing component interactions in the Sandro Portfolio project. Integration tests verify that components work together as expected, ensuring that data flows correctly between components and that component compositions function as intended.

## Integration Testing Overview

Integration tests focus on testing the interactions between multiple components, ensuring they work together correctly. These tests are particularly valuable for:

1. Verifying data flow between parent and child components
2. Testing component compositions and page layouts
3. Ensuring proper context provider integration
4. Testing user flows that span multiple components

## Testing Component Interactions

### Parent-Child Component Testing

When testing parent-child component interactions:

1. Render the parent component with its children
2. Test that props are correctly passed down to children
3. Verify that callbacks from children update the parent as expected
4. Test that state changes in the parent affect children appropriately

Example:

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

describe('Tabs Integration', () => {
  it('shows correct content when tab is selected', async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    
    // Initially, Tab 1 content should be visible
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.queryByText('Content 2')).not.toBeVisible();
    
    // Click on Tab 2
    await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    
    // Now Tab 2 content should be visible
    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeVisible();
  });
});
```

### Context Provider Integration

For components that rely on context providers:

1. Test components with their respective providers
2. Verify that context values are properly consumed
3. Test context updates and their effects on components
4. Ensure proper fallback behavior when context is missing

Example:

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

describe('Theme Provider Integration', () => {
  it('toggles theme when button is clicked', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    
    // Initially should be in light mode
    expect(document.documentElement).toHaveClass('light');
    
    // Click toggle button
    await userEvent.click(toggleButton);
    
    // Should switch to dark mode
    expect(document.documentElement).toHaveClass('dark');
  });
});
```

## Testing Component Compositions

### Layout Components

When testing layout components and their children:

1. Test that layout components render their children correctly
2. Verify that layout-specific styling is applied
3. Test responsive behavior where applicable
4. Ensure proper slot usage in composition patterns

Example:

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card Component Composition', () => {
  it('renders all card parts in correct structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Main content</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    
    // Verify all parts render in the correct order
    const card = screen.getByText('Card Title').closest('.card');
    expect(card).toBeInTheDocument();
    
    const cardContent = within(card).getByText('Main content');
    expect(cardContent).toBeInTheDocument();
    
    // Check proper nesting
    expect(screen.getByText('Card Title').closest('.card-header')).toBeInTheDocument();
    expect(screen.getByText('Card Description').closest('.card-header')).toBeInTheDocument();
    expect(screen.getByText('Footer content').closest('.card-footer')).toBeInTheDocument();
  });
});
```

## Testing Page Compositions

For testing entire page compositions:

1. Render the page component
2. Verify all major sections are present
3. Test interactions that span multiple sections
4. Test data flow across the page

Example:

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import HomePage from '@/app/page';

describe('Home Page Integration', () => {
  it('renders all main sections', () => {
    render(<HomePage />);
    
    // Check that major sections are rendered
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('about-section')).toBeInTheDocument();
    expect(screen.getByTestId('projects-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact-section')).toBeInTheDocument();
  });
  
  it('navigates between sections when nav links are clicked', async () => {
    render(<HomePage />);
    
    // Find navigation links
    const aboutLink = screen.getByRole('link', { name: /about/i });
    
    // Click on About link
    await userEvent.click(aboutLink);
    
    // Verify section is visible (possibly scrolled into view)
    // This may require implementation-specific testing
    const aboutSection = screen.getByTestId('about-section');
    expect(aboutSection).toBeVisible();
    // May need to test for scrollIntoView being called or other scroll behavior
  });
});
```

## Testing Data Flow

To test data flow between components:

1. Test that data passed to parent components is correctly distributed to children
2. Verify that changes in child components properly update parent state
3. Test complex data transformations between components
4. Ensure proper error handling in data flow

Example:

```tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ProjectList } from '@/components/projects/project-list';
import { ProjectFilter } from '@/components/projects/project-filter';
import { ProjectSection } from '@/components/sections/project-section';

describe('Project Section Data Flow', () => {
  it('filters projects when filter is applied', async () => {
    const allProjects = [
      { id: '1', title: 'Web App', category: 'web' },
      { id: '2', title: 'Mobile App', category: 'mobile' },
      { id: '3', title: 'Desktop App', category: 'desktop' }
    ];
    
    render(<ProjectSection projects={allProjects} />);
    
    // Initially all projects should be visible
    expect(screen.getByText('Web App')).toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
    expect(screen.getByText('Desktop App')).toBeInTheDocument();
    
    // Select mobile filter
    const filterSelect = screen.getByLabelText(/filter by category/i);
    await userEvent.selectOptions(filterSelect, 'mobile');
    
    // Now only mobile app should be visible
    expect(screen.queryByText('Web App')).not.toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
    expect(screen.queryByText('Desktop App')).not.toBeInTheDocument();
  });
});
```

## Testing Form Submissions

For testing form submissions across components:

1. Test the entire form submission flow
2. Verify validation across multiple form components
3. Test form state management across components
4. Ensure proper error handling and feedback

Example:

```tsx
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/contact/contact-form';

describe('Contact Form Submission', () => {
  it('validates all fields and submits form data', async () => {
    const handleSubmit = jest.fn();
    
    render(<ContactForm onSubmit={handleSubmit} />);
    
    // Fill out form fields
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message');
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify submit handler was called with correct data
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      });
    });
  });
  
  it('shows validation errors for invalid inputs', async () => {
    render(<ContactForm onSubmit={jest.fn()} />);
    
    // Submit without filling form
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify error messages
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
  });
});
```

## Testing with Mocks

For testing components that rely on external services:

1. Mock API calls and services
2. Test components with various mock responses
3. Verify error handling with failed service calls
4. Test loading states during async operations

Example:

```tsx
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import { ProjectGallery } from '@/components/projects/project-gallery';
import * as projectService from '@/lib/services/project-service';

// Mock the service
jest.mock('@/lib/services/project-service');

describe('Project Gallery with API Integration', () => {
  it('loads and displays projects from API', async () => {
    const mockProjects = [
      { id: '1', title: 'Project 1', imageUrl: '/image1.jpg' },
      { id: '2', title: 'Project 2', imageUrl: '/image2.jpg' }
    ];
    
    // Setup mock implementation
    (projectService.fetchProjects as jest.Mock).mockResolvedValue(mockProjects);
    
    render(<ProjectGallery />);
    
    // Should show loading state initially
    expect(screen.getByText(/loading projects/i)).toBeInTheDocument();
    
    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
    });
  });
  
  it('handles API errors gracefully', async () => {
    // Setup mock implementation for error
    (projectService.fetchProjects as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    render(<ProjectGallery />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/error loading projects/i)).toBeInTheDocument();
    });
  });
});
```

## Best Practices

1. **Focus on real user flows**: Test how users will actually interact with the application
2. **Use realistic data**: Use data that resembles what would appear in production
3. **Test error states**: Ensure components handle errors gracefully
4. **Limit test scope**: Keep tests focused on specific interactions rather than testing everything at once
5. **Avoid implementation details**: Test behavior users would experience, not internal implementation

## Common Pitfalls

1. Trying to test too much in a single test
2. Testing implementation details instead of user-facing behavior
3. Not properly mocking dependencies or API calls
4. Creating brittle tests that break with minor changes
5. Not considering edge cases in component interactions

## Tools and Utilities

For efficient integration testing, take advantage of:

1. **Custom render functions**: Use the project's `test-utils.tsx` for consistent rendering
2. **Mock data generators**: Create utilities for generating test data
3. **User event library**: For simulating real user interactions
4. **Testing context providers**: Create reusable test wrappers for context providers

## Resources

For more information on integration testing:

- [React Testing Library Integration Testing](https://testing-library.com/docs/react-testing-library/example-intro)
- [Testing React Components](https://reactjs.org/docs/testing-recipes.html)
- [Testing Library Queries Best Practices](https://testing-library.com/docs/queries/about#priority) 