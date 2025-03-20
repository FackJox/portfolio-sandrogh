# Project Specification: Sandro Portfolio

## Overview

This project is a Next.js application built with React 19 and TypeScript. It implements a comprehensive set of accessible, reusable UI components powered by Radix UI primitives and styled with Tailwind CSS. The project follows a consistent architecture pattern with a focus on component composition, accessibility, and type safety.

## Technology Stack

### Core Technologies
- **Next.js**: v15.1.0 - React framework
- **React**: v19 
- **TypeScript**: For type safety and developer experience
- **Tailwind CSS**: For utility-first styling

### Key Libraries
- **Radix UI**: Extensive use of Radix primitives for accessible components
- **react-hook-form**: For form handling (v7.54.1)
- **zod**: For schema validation (v3.24.1)
- **class-variance-authority**: For component variant management
- **tailwind-merge**: For combining Tailwind classes
- **embla-carousel-react**: For carousel functionality
- **Lucide React**: For icon components
- **date-fns**: For date handling
- **recharts**: For chart components
- **sonner**: For toast notifications
- **input-otp**: For one-time password inputs
- **react-resizable-panels**: For resizable layout components

## Project Structure

The project follows a Next.js App Router structure with a well-organized component hierarchy:

```
├── app/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── MediaCategories.tsx
│   │   ├── featured-work-carousel.tsx
│   │   ├── InstagramFeed.tsx
│   │   └── Testimonials.tsx
│   ├── ui/
│   │   ├── data-display/
│   │   │   ├── accordion.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   └── table.tsx
│   │   ├── feedback/
│   │   │   ├── alert.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── use-toast.ts
│   │   ├── form/
│   │   │   ├── button.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── label.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── select.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toggle.tsx
│   │   │   └── toggle-group.tsx
│   │   ├── layout/
│   │   │   ├── collapsible.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── separator.tsx
│   │   │   └── sidebar.tsx
│   │   ├── media/
│   │   │   ├── aspect-ratio.tsx
│   │   │   └── carousel.tsx
│   │   ├── navigation/
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── tabs.tsx
│   │   ├── overlay/
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── tooltip.tsx
│   │   ├── theming/
│   │   │   └── theme-provider.tsx
│   │   └── util/
│   │       ├── copyright-year.tsx
│   │       └── use-mobile.tsx
├── hooks/
│   ├── use-toast.ts
│   └── use-mobile.tsx
├── lib/
│   └── utils.ts
├── public/
└── ...
```

## Component Organization

The project components are organized into logical categories for better maintainability and discoverability:

### Application-specific Components

1. **Layout Components** (`components/layout/`): 
   - Components that define the overall page structure
   - Examples: Header, Footer

2. **Section Components** (`components/sections/`):
   - Page-specific sections or feature areas
   - Examples: Hero, About, Contact, MediaCategories

### UI Components

UI components are organized by their functionality:

1. **Data Display** (`components/ui/data-display/`):
   - Components for displaying data and content
   - Examples: Accordion, Avatar, Badge, Calendar, Card, Table, Chart

2. **Feedback** (`components/ui/feedback/`):
   - Components that provide user feedback
   - Examples: Alert, Progress, Skeleton, Toast

3. **Form** (`components/ui/form/`):
   - Components for user input and form handling
   - Examples: Button, Checkbox, Input, Radio, Select, Toggle

4. **Layout** (`components/ui/layout/`):
   - Components for layout management
   - Examples: Collapsible, Resizable, Separator, Sidebar

5. **Media** (`components/ui/media/`):
   - Components for media display and interaction
   - Examples: Aspect Ratio, Carousel

6. **Navigation** (`components/ui/navigation/`):
   - Components for navigation and wayfinding
   - Examples: Breadcrumb, Navigation Menu, Pagination, Tabs

7. **Overlay** (`components/ui/overlay/`):
   - Components that overlay the UI
   - Examples: Dialog, Drawer, Dropdown Menu, Tooltip, Command

8. **Theming** (`components/ui/theming/`):
   - Components for theme management
   - Examples: Theme Provider

9. **Utilities** (`components/ui/util/`):
   - Utility components and hooks
   - Examples: Copyright Year, use-mobile

## Benefits of Component Organization

The reorganized component structure provides several key advantages:

### 1. Improved Developer Experience

- **Faster Component Discovery**: Developers can quickly locate components by their functional category
- **Reduced Cognitive Load**: Clear categorization helps understand the purpose of each component
- **Intuitive Navigation**: Directory structure reflects the logical grouping of related components

### 2. Better Maintainability

- **Scalable Architecture**: New components can be easily added to appropriate categories
- **Reduced File Clutter**: Components are distributed across multiple directories instead of one large folder
- **Consistent Patterns**: Organizational structure enforces consistency in component development

### 3. Enhanced Collaboration

- **Clear Ownership**: Teams can work on different component categories simultaneously
- **Predictable Import Paths**: Standardized import pattern makes integration straightforward
- **Self-Documenting Structure**: Directory organization itself communicates component purpose and usage

### 4. Future-Proofing

- **Extensible System**: New component categories can be added as the application grows
- **Simplified Refactoring**: Related components are grouped together, making architectural changes easier
- **Framework Agnostic**: The organizational pattern can be maintained even if underlying technologies change

## Component Architecture

The project follows a consistent component architecture pattern across all UI components:

### Component Structure Pattern

1. **Base Components**: 
   - Built with Radix UI primitives
   - Implement forwardRef for ref forwarding
   - Use Tailwind CSS for styling via the `cn()` utility

2. **Component Composition**:
   - Components are split into smaller, composable parts
   - Each part is exported individually
   - Components maintain their own display names

3. **Styling Approach**:
   - Uses class-variance-authority for variant management
   - Consistent styling across components
   - CSS variables for themeable properties

4. **State Management**:
   - Context API for component-level state
   - Custom hooks for consuming context
   - Clear error messages when components are used incorrectly

### Advanced Component Patterns

For more complex components, the project uses a separation of concerns across multiple files:

1. **UI Primitives**: Base components in their respective category folders (e.g., `components/ui/form/button.tsx`)
2. **Logic/State**: Custom hooks in `hooks/use-[component].ts`
3. **Composition**: Application-specific components that compose primitives

For example, the toast system is split across:
- `components/ui/feedback/toast.tsx`: Base toast components
- `hooks/use-toast.ts`: Toast state management
- `components/ui/feedback/toaster.tsx`: Application-specific toast renderer

## Design System

The project implements a comprehensive design system using Tailwind CSS:

### Colors

Uses HSL color variables for a themeable approach:
```css
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;
/* ... */
```

### Typography

Consistent text styling with:
- Font sizes via Tailwind's text-* classes
- Font weights (semibold, medium, etc.)
- Line heights and letter spacing

### Spacing

Uses Tailwind's spacing scale for consistency:
- Padding and margins
- Gap between elements
- Component sizing

### Animations

Custom keyframes defined in `tailwind.config.js`:
- Accordion animations
- Toast entrance/exit animations
- Other interactive elements

## Key Components and Features

### 1. Toast Notification System

A comprehensive toast notification system with:

```typescript
// Create and display a toast
toast({
  title: "Success",
  description: "Your action was completed successfully.",
  variant: "default", // or "destructive"
})
```

Features:
- Multiple toast types (default, destructive)
- Customizable content (title, description, action)
- Automatic removal after timeout
- Swipe to dismiss
- Accessibility support
- Toast limit management

### 2. Tooltip Component

An accessible tooltip component:

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Tooltip content</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

Features:
- Multiple positioning options
- Animation on enter/exit
- Consistent styling with design system
- Full accessibility support

### 3. Carousel Component

A fully accessible carousel using embla-carousel-react:

```tsx
<Carousel>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

Features:
- Horizontal and vertical orientations
- Navigation controls
- Keyboard accessibility
- Touch/swipe support
- Custom API access

### 4. Form Components

Integrated with react-hook-form and zod for validation:

```tsx
<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### 5. Input OTP Component

One-time password input with accessibility support:

```tsx
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    {/* ... */}
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

### 6. Additional Components

- **Button**: With multiple variants and sizes
- **Sidebar**: For navigation layouts
- **Chart**: Data visualization components
- **Resizable Panels**: For adjustable layouts
- **Accordion, Dialog, Popover**: Standard UI components
- **And many more**: The project includes a comprehensive set of UI components

## Development Workflow

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

The development server will start on `http://localhost:3000`.

### Building for Production

```bash
npm run build
# or
yarn build
```

## Component Development Guide

### Creating a New Component

1. Identify the appropriate category for the component (data-display, form, overlay, etc.)
2. Create a new file in the corresponding category folder (e.g., `components/ui/form/my-component.tsx`)
3. Import necessary Radix UI primitives
4. Define component variants using class-variance-authority (if needed)
5. Implement the component using the forwardRef pattern
6. Style using Tailwind classes with the `cn()` utility
7. Export all sub-components

Example skeleton:

```tsx
"use client"

import * as React from "react"
import * as PrimitiveName from "@radix-ui/react-primitive-name"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Define variants if needed
const componentVariants = cva(
  "base-styles-here",
  {
    variants: {
      variant: { /* variants here */ },
      size: { /* sizes here */ },
    },
    defaultVariants: { /* defaults here */ },
  }
)

// Main component
const Component = React.forwardRef<
  React.ElementRef<typeof PrimitiveName.Root>,
  React.ComponentPropsWithoutRef<typeof PrimitiveName.Root> &
    VariantProps<typeof componentVariants>
>(({ className, variant, ...props }, ref) => (
  <PrimitiveName.Root
    ref={ref}
    className={cn(componentVariants({ variant }), className)}
    {...props}
  />
))
Component.displayName = "Component"

// Export all parts
export { Component, ComponentPart1, ComponentPart2 }
```

If the component needs to reference other components, import them from their respective category folders:

```tsx
// Example imports
import { Button } from "@/components/ui/form/button"
import { Tooltip } from "@/components/ui/overlay/tooltip"
import { Separator } from "@/components/ui/layout/separator"
```

### Adding Component State

If the component needs to manage state across sub-components:

1. Create a React context
2. Implement a custom hook to consume the context
3. Add proper error handling for when components are used incorrectly

Example:

```tsx
// 1. Create context
interface ComponentContext {
  state: string
  setState: (state: string) => void
}

const ComponentContext = React.createContext<ComponentContext | null>(null)

// 2. Create custom hook
function useComponent() {
  const context = React.useContext(ComponentContext)
  if (!context) {
    throw new Error("useComponent must be used within a Component")
  }
  return context
}

// 3. Provide context in the main component
const Component = ({ children }) => {
  const [state, setState] = React.useState("")
  
  return (
    <ComponentContext.Provider value={{ state, setState }}>
      {children}
    </ComponentContext.Provider>
  )
}
```

### Adding a New Page Section or Layout Component

When creating new application-specific components:

1. For page sections, create a new file in the `components/sections/` directory
2. For layout components, create a new file in the `components/layout/` directory
3. Follow the established patterns and naming conventions
4. Import UI components from their respective category folders

Example section component:

```tsx
import { Button } from "@/components/ui/form/button"
import { Separator } from "@/components/ui/layout/separator"

export function NewSection() {
  return (
    <section className="py-20 bg-black">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">SECTION TITLE</h2>
        <Separator className="my-8" />
        <Button>Call to Action</Button>
      </div>
    </section>
  )
}
```

## Theming

The project uses CSS variables for theming, defined in `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* other dark mode variables */
}
```

To implement dark mode, the project uses `next-themes` package.

## Next Steps for Development

While this specification covers the UI component system in detail, a complete project would need:

1. **Page Components**: 
   - Create page components in `app/(routes)/` following Next.js App Router conventions
   - Implement layouts for different sections

2. **Data Fetching**:
   - Implement data fetching with Next.js Server Components or client-side fetching
   - Add loading and error states

3. **State Management**:
   - Choose a state management solution for application state (Context API, Zustand, etc.)
   - Implement auth state if needed

4. **Testing**:
   - Add unit tests for components
   - Implement integration tests for features
   - Set up end-to-end testing

5. **Documentation**:
   - Create a documentation site or storybook for components
   - Add usage examples

## Conclusion

This project implements a comprehensive UI component library built on modern React practices with a focus on accessibility, composability, and type safety. The component architecture follows consistent patterns that make it easy to extend and maintain. 

The well-structured organization of components into logical categories enhances developer experience and project maintainability. This categorization improves discoverability, enforces consistent patterns, and provides a scalable foundation for future development.

With its thoughtful separation of concerns and intuitive directory structure, the project provides a solid foundation for building complex applications while ensuring long-term maintainability and collaboration efficiency.
