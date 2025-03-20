import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';
import { hasClasses, hasDataAttribute } from '../../__tests__/utils/test-utils';

// Mock next/link as it's a common practice when testing Next.js components
jest.mock('next/link', () => {
  return ({ children, href, className }) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

// Mock the Sheet component from Radix UI
jest.mock('@/components/ui/overlay/sheet', () => {
  return {
    Sheet: ({ children }) => <div data-testid="sheet">{children}</div>,
    SheetTrigger: ({ children }) => <div data-testid="sheet-trigger">{children}</div>,
    SheetContent: ({ children, side, className }) => (
      <div data-testid="sheet-content" data-side={side} className={className}>
        {children}
      </div>
    ),
  };
});

describe('Header', () => {
  // 1. Test basic rendering with all expected elements
  it('renders correctly with all expected elements', () => {
    render(<Header />);
    
    // Check logo/brand is present
    const logo = screen.getByText('SANDRO GH');
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe('A');
    expect(logo).toHaveAttribute('href', '/');
    expect(logo).toHaveClass('text-xl', 'font-bold', 'tracking-tight');
    
    // Check desktop navigation is present - be more specific with our selector
    const header = screen.getByRole('banner');
    const desktopNav = within(header).getAllByRole('navigation')[0]; // Get the first nav element in the header
    expect(desktopNav).toBeInTheDocument();
    expect(desktopNav).toHaveClass('hidden', 'md:flex');
    
    // Check mobile menu trigger is present
    const mobileMenuTrigger = screen.getByRole('button', { name: /open menu/i });
    expect(mobileMenuTrigger).toBeInTheDocument();
    expect(mobileMenuTrigger).toHaveClass('md:hidden');
  });

  // 2. Test navigation links presence and correct href attributes
  it('contains all expected navigation links with correct href attributes', () => {
    render(<Header />);
    
    // Get the header and desktop navigation
    const header = screen.getByRole('banner');
    const desktopNav = within(header).getAllByRole('navigation')[0];
    
    // Check all navigation links in desktop view using within
    const portfolioLink = within(desktopNav).getByText('PORTFOLIO');
    expect(portfolioLink).toBeInTheDocument();
    expect(portfolioLink).toHaveAttribute('href', '/portfolio');
    
    const aboutLink = within(desktopNav).getByText('ABOUT');
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '#about');
    
    const followLink = within(desktopNav).getByText('FOLLOW');
    expect(followLink).toBeInTheDocument();
    expect(followLink).toHaveAttribute('href', '#contact');
    
    // Check connect button is present in desktop nav
    const connectButton = within(desktopNav).getByRole('button', { name: /connect/i });
    expect(connectButton).toBeInTheDocument();
    expect(connectButton).toHaveClass('rounded-full');
  });
  
  // 3. Test logo rendering
  it('renders the logo with correct styling and link', () => {
    render(<Header />);
    
    const logo = screen.getByText('SANDRO GH');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('href', '/');
    expect(logo).toHaveClass('text-xl', 'font-bold');
  });

  // 4. Test mobile navigation behavior using mocked Sheet component
  it('includes mobile navigation with correct content', () => {
    render(<Header />);
    
    // Check that sheet components are present
    const sheetTrigger = screen.getByTestId('sheet-trigger');
    expect(sheetTrigger).toBeInTheDocument();
    
    // Check the sheet content
    const sheetContent = screen.getByTestId('sheet-content');
    expect(sheetContent).toBeInTheDocument();
    expect(sheetContent).toHaveAttribute('data-side', 'right');
    expect(sheetContent).toHaveClass('bg-black', 'text-white');
    
    // Check mobile navigation links are present in the sheet content
    const mobileNav = sheetContent.querySelector('nav');
    expect(mobileNav).toBeInTheDocument();
    expect(mobileNav).toHaveClass('flex', 'flex-col', 'space-y-6', 'pt-10');
    
    // Check nav links in the mobile menu
    const portfolioLink = within(sheetContent).getByText('PORTFOLIO');
    expect(portfolioLink).toBeInTheDocument();
    expect(portfolioLink).toHaveClass('text-lg');
    
    // Check mobile connect button exists
    const mobileConnectButton = within(sheetContent).getByRole('button', { name: /connect/i });
    expect(mobileConnectButton).toBeInTheDocument();
    expect(mobileConnectButton).toHaveClass('w-full');
  });

  // 5. Test header positioning and styling
  it('has the correct positioning and styling', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
    expect(header).toHaveClass('bg-black/80', 'backdrop-blur-sm');
    
    // Check container has proper padding and flex layout
    const container = header.firstChild;
    expect(container).toHaveClass('container', 'flex', 'items-center', 'justify-between', 'py-4');
  });

  // 6. Test navigation link hover effects (visual styles)
  it('has proper hover styles for navigation links', () => {
    render(<Header />);
    
    // Get the header and desktop navigation
    const header = screen.getByRole('banner');
    const desktopNav = within(header).getAllByRole('navigation')[0];
    
    // Check desktop nav links have hover transition classes
    const navLinks = within(desktopNav).getAllByRole('link');
    navLinks.forEach(link => {
      expect(link).toHaveClass('hover:text-primary', 'transition-colors');
    });
  });

  // 7. Test accessibility features
  it('has proper accessibility attributes', () => {
    render(<Header />);
    
    // Mobile menu button should have proper accessibility
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    // Check for sr-only element that provides accessible name
    const srOnlyText = menuButton.querySelector('.sr-only');
    expect(srOnlyText).toBeInTheDocument();
    expect(srOnlyText.textContent).toBe('Open menu');
    
    // Navigation should be accessible via keyboard
    // Get the header and desktop navigation
    const header = screen.getByRole('banner');
    const desktopNav = within(header).getAllByRole('navigation')[0];
    const navLinks = within(desktopNav).getAllByRole('link');
    
    navLinks.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  // 8. Test responsive display logic
  it('properly hides/shows elements based on screen size', () => {
    render(<Header />);
    
    // Desktop navigation should be hidden on mobile
    const header = screen.getByRole('banner');
    const desktopNav = within(header).getAllByRole('navigation')[0];
    expect(desktopNav).toHaveClass('hidden', 'md:flex');
    
    // Mobile menu button should be hidden on desktop
    const mobileMenuTrigger = screen.getByRole('button', { name: /open menu/i });
    expect(mobileMenuTrigger).toHaveClass('md:hidden');
  });
}); 