import * as React from "react"
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './textarea'

describe('Textarea Component', () => {
  // Rendering Tests
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Textarea className="custom-class" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('custom-class')
    })

    it('renders with placeholder text', () => {
      const placeholder = 'Enter your message'
      render(<Textarea placeholder={placeholder} />)
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
    })

    it('merges custom className with default classes', () => {
      render(<Textarea className="custom-class" />)
      const textarea = screen.getByRole('textbox')
      
      // Check that it has both custom and default classes
      expect(textarea).toHaveClass('custom-class')
      expect(textarea).toHaveClass('flex')
      expect(textarea).toHaveClass('min-h-[80px]')
      expect(textarea).toHaveClass('w-full')
      expect(textarea).toHaveClass('rounded-md')
    })
  })

  // Behavior Tests
  describe('Behavior', () => {
    it('updates value when typing', async () => {
      const user = userEvent.setup()
      render(<Textarea />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Hello World')
      
      expect(textarea).toHaveValue('Hello World')
    })

    it('handles controlled input', async () => {
      const handleChange = jest.fn()
      const { rerender } = render(
        <Textarea value="Initial value" onChange={handleChange} />
      )
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('Initial value')
      
      // Update the controlled value
      rerender(<Textarea value="Updated value" onChange={handleChange} />)
      expect(textarea).toHaveValue('Updated value')
    })

    it('calls onChange handler when typing', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Textarea onChange={handleChange} />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'a')
      
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('respects disabled attribute', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Textarea disabled onChange={handleChange} />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
      
      // Attempt to type in disabled textarea
      await user.type(textarea, 'test')
      
      // Verify the onChange was not called
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  // Focus and Blur Events
  describe('Focus and Blur Events', () => {
    it('handles focus event', async () => {
      const handleFocus = jest.fn()
      const user = userEvent.setup()
      
      render(<Textarea onFocus={handleFocus} />)
      
      const textarea = screen.getByRole('textbox')
      await user.click(textarea)
      
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('handles blur event', async () => {
      const handleBlur = jest.fn()
      const user = userEvent.setup()
      
      render(<Textarea onBlur={handleBlur} />)
      
      const textarea = screen.getByRole('textbox')
      
      // Focus then blur
      await user.click(textarea)
      await user.tab() // Move focus to the next element
      
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('applies focus-visible styles on keyboard focus', async () => {
      const user = userEvent.setup()
      render(<Textarea />)
      
      const textarea = screen.getByRole('textbox')
      
      // Tab to focus the element (keyboard focus)
      await user.tab()
      
      // Check for focus-visible styling classes
      expect(textarea).toHaveClass('focus-visible:outline-none')
      expect(textarea).toHaveClass('focus-visible:ring-2')
      expect(textarea).toHaveClass('focus-visible:ring-ring')
      expect(textarea).toHaveClass('focus-visible:ring-offset-2')
    })
  })

  // Form Integration
  describe('Form Integration', () => {
    it('integrates with form submission', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault())
      const user = userEvent.setup()
      
      render(
        <form onSubmit={handleSubmit}>
          <Textarea name="message" />
          <button type="submit">Submit</button>
        </form>
      )
      
      // Type in textarea and submit form
      await user.type(screen.getByRole('textbox'), 'Test message')
      await user.click(screen.getByRole('button', { name: /submit/i }))
      
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    it('accepts required attribute', () => {
      render(<Textarea required />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeRequired()
    })
  })

  // ForwardRef Implementation
  describe('ForwardRef Implementation', () => {
    it('forwards ref to the textarea element', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      render(<Textarea ref={ref} />)
      
      expect(ref.current).not.toBeNull()
      expect(ref.current?.tagName).toBe('TEXTAREA')
    })

    it('allows focus via ref', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      render(<Textarea ref={ref} />)
      
      ref.current?.focus()
      expect(document.activeElement).toBe(ref.current)
    })
  })

  // Accessibility
  describe('Accessibility', () => {
    it('maintains accessibility attributes', () => {
      render(
        <Textarea
          aria-label="Message"
          aria-describedby="message-help"
          aria-invalid={true}
        />
      )
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-label', 'Message')
      expect(textarea).toHaveAttribute('aria-describedby', 'message-help')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })
  })
}) 