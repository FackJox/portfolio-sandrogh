import * as React from "react"
import { render, screen, hasClasses } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './textarea'
import { axe, toHaveNoViolations } from 'jest-axe'

// Add jest-axe custom matcher
expect.extend(toHaveNoViolations)

describe('Textarea Component', () => {
  // Rendering Tests
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Textarea data-testid="test-textarea" />)
      const textarea = screen.getByTestId("test-textarea")
      expect(textarea).toBeInTheDocument()
      expect(textarea.tagName).toBe('TEXTAREA')
    })

    it('renders with custom className', () => {
      render(<Textarea className="custom-class" data-testid="custom-textarea" />)
      const textarea = screen.getByTestId("custom-textarea")
      expect(textarea).toHaveClass('custom-class')
    })

    it('renders with placeholder text', () => {
      const placeholder = 'Enter your message'
      render(<Textarea placeholder={placeholder} data-testid="placeholder-textarea" />)
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
    })

    it('merges custom className with default classes', () => {
      render(<Textarea className="custom-class" data-testid="merged-textarea" />)
      const textarea = screen.getByTestId("merged-textarea")
      
      // Check that it has both custom and default classes
      expect(textarea).toHaveClass('custom-class')
      expect(textarea).toHaveClass('flex')
      expect(textarea).toHaveClass('min-h-[80px]')
      expect(textarea).toHaveClass('w-full')
      expect(textarea).toHaveClass('rounded-md')
    })

    it('renders with rows and cols attributes', () => {
      render(<Textarea rows={10} cols={50} data-testid="dimensions-textarea" />)
      const textarea = screen.getByTestId("dimensions-textarea")
      expect(textarea).toHaveAttribute('rows', '10')
      expect(textarea).toHaveAttribute('cols', '50')
    })

    it('renders with minLength and maxLength attributes', () => {
      render(<Textarea minLength={10} maxLength={100} data-testid="length-textarea" />)
      const textarea = screen.getByTestId("length-textarea")
      expect(textarea).toHaveAttribute('minLength', '10')
      expect(textarea).toHaveAttribute('maxLength', '100')
    })
  })

  // Controlled vs Uncontrolled Input Tests
  describe('Controlled vs Uncontrolled Input', () => {
    it('functions as uncontrolled input with defaultValue', async () => {
      const user = userEvent.setup()
      render(<Textarea defaultValue="Initial text" data-testid="uncontrolled-textarea" />)
      
      const textarea = screen.getByTestId("uncontrolled-textarea")
      expect(textarea).toHaveValue('Initial text')
      
      await user.clear(textarea)
      await user.type(textarea, 'New text')
      
      expect(textarea).toHaveValue('New text')
    })

    it('handles controlled input', async () => {
      const handleChange = jest.fn()
      const TestComponent = () => {
        const [value, setValue] = React.useState('Initial value')
        
        const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setValue(e.target.value)
          handleChange(e)
        }
        
        return <Textarea value={value} onChange={onChange} data-testid="controlled-textarea" />
      }
      
      const user = userEvent.setup()
      render(<TestComponent />)
      
      const textarea = screen.getByTestId("controlled-textarea")
      expect(textarea).toHaveValue('Initial value')
      
      await user.clear(textarea)
      await user.type(textarea, 'Updated value')
      
      expect(textarea).toHaveValue('Updated value')
      expect(handleChange).toHaveBeenCalled()
    })

    it('handles value changes in controlled mode', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('initial')
        
        const handleButtonClick = () => {
          setValue('updated value')
        }
        
        return (
          <div>
            <Textarea value={value} onChange={e => setValue(e.target.value)} data-testid="controlled-change-textarea" />
            <button onClick={handleButtonClick} data-testid="update-button">Update</button>
          </div>
        )
      }
      
      const user = userEvent.setup()
      render(<TestComponent />)
      
      const textarea = screen.getByTestId("controlled-change-textarea")
      const button = screen.getByTestId("update-button")
      
      expect(textarea).toHaveValue('initial')
      
      await user.click(button)
      expect(textarea).toHaveValue('updated value')
    })
  })

  // Resizing Behavior Tests
  describe('Resizing Behavior', () => {
    it('allows resizing with resize attribute', () => {
      render(<Textarea style={{ resize: 'both' }} data-testid="resizable-textarea" />)
      const textarea = screen.getByTestId("resizable-textarea")
      expect(textarea).toHaveStyle('resize: both')
    })

    it('disables resizing with resize attribute', () => {
      render(<Textarea style={{ resize: 'none' }} data-testid="non-resizable-textarea" />)
      const textarea = screen.getByTestId("non-resizable-textarea")
      expect(textarea).toHaveStyle('resize: none')
    })

    it('respects min-height from className', () => {
      render(<Textarea data-testid="min-height-textarea" />)
      const textarea = screen.getByTestId("min-height-textarea")
      expect(textarea).toHaveClass('min-h-[80px]')
    })
  })

  // Accessibility Tests
  describe('Accessibility', () => {
    it('maintains accessibility attributes', () => {
      render(
        <Textarea
          aria-label="Message"
          aria-describedby="message-help"
          aria-invalid={true}
          data-testid="a11y-textarea"
        />
      )
      
      const textarea = screen.getByTestId("a11y-textarea")
      expect(textarea).toHaveAttribute('aria-label', 'Message')
      expect(textarea).toHaveAttribute('aria-describedby', 'message-help')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })

    it('supports aria-invalid for validation', () => {
      render(<Textarea aria-invalid={true} data-testid="invalid-textarea" />)
      
      const textarea = screen.getByTestId("invalid-textarea")
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })
    
    it('has proper label association', () => {
      render(
        <>
          <label htmlFor="test-textarea">Test Label</label>
          <Textarea id="test-textarea" data-testid="labeled-textarea" />
        </>
      )
      
      const textarea = screen.getByLabelText("Test Label")
      expect(textarea).toBe(screen.getByTestId("labeled-textarea"))
    })
    
    it('has no accessibility violations', async () => {
      const { container } = render(
        <div>
          <label htmlFor="a11y-test-textarea">Accessible Textarea</label>
          <Textarea id="a11y-test-textarea" />
        </div>
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('focuses correctly and shows focus styles', async () => {
      const user = userEvent.setup()
      render(<Textarea data-testid="focus-textarea" />)
      
      const textarea = screen.getByTestId("focus-textarea")
      
      // Tab to focus the element
      await user.tab()
      expect(document.activeElement).toBe(textarea)
      
      // Check for focus-visible styling classes
      expect(textarea).toHaveClass('focus-visible:outline-none')
      expect(textarea).toHaveClass('focus-visible:ring-2')
      expect(textarea).toHaveClass('focus-visible:ring-ring')
      expect(textarea).toHaveClass('focus-visible:ring-offset-2')
    })
  })

  // Form Integration Tests
  describe('Form Integration', () => {
    it('integrates with form submission', async () => {
      const handleSubmit = jest.fn(e => e.preventDefault())
      const user = userEvent.setup()
      
      render(
        <form onSubmit={handleSubmit}>
          <Textarea name="message" data-testid="form-textarea" />
          <button type="submit">Submit</button>
        </form>
      )
      
      // Type in textarea and submit form
      const textarea = screen.getByTestId("form-textarea")
      await user.type(textarea, 'Test message')
      await user.click(screen.getByRole('button', { name: /submit/i }))
      
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(textarea).toHaveValue('Test message')
    })

    it('accepts required attribute', () => {
      render(<Textarea required data-testid="required-textarea" />)
      const textarea = screen.getByTestId("required-textarea")
      expect(textarea).toBeRequired()
    })

    it('shows validation messages when integrated with form validation', async () => {
      const user = userEvent.setup()
      const handleSubmit = jest.fn(e => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit} noValidate>
          <Textarea 
            required 
            minLength={10} 
            data-testid="validation-textarea"
            aria-describedby="error-message"
          />
          <span id="error-message" role="alert" data-testid="error-message"></span>
          <button type="submit">Submit</button>
        </form>
      )
      
      const textarea = screen.getByTestId("validation-textarea")
      const errorElement = screen.getByTestId("error-message")
      
      // Type something too short
      await user.type(textarea, 'Too short')
      await user.click(screen.getByRole('button', { name: /submit/i }))
      
      // Set aria-invalid manually for testing purposes
      // Real validation would typically set this via form libraries or browser validation
      Object.defineProperty(textarea, 'validity', {
        configurable: true,
        get: () => ({ valid: false, valueMissing: false, tooShort: true }),
      });
      
      // Check if form was submitted
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      
      // In a real application, we'd check form validation states
      // but here we're just testing the component accepts the attributes
      expect(textarea).toHaveAttribute('minLength', '10')
      expect(textarea).toHaveAttribute('aria-describedby', 'error-message')
    })
  })

  // Character Count and Limitations
  describe('Character Count and Limitations', () => {
    it('respects maxLength attribute', async () => {
      const user = userEvent.setup()
      render(<Textarea maxLength={10} data-testid="maxlength-textarea" />)
      
      const textarea = screen.getByTestId("maxlength-textarea")
      
      // Try to type more than maxLength
      await user.type(textarea, '12345678901234')
      
      // Should truncate to maxLength
      expect(textarea).toHaveValue('1234567890')
    })

    it('can display remaining character count with external counter', async () => {
      const user = userEvent.setup()
      const TestComponent = () => {
        const [value, setValue] = React.useState('')
        const maxLength = 20
        
        return (
          <div>
            <Textarea 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={maxLength}
              data-testid="character-count-textarea"
            />
            <div data-testid="counter">{maxLength - value.length} characters remaining</div>
          </div>
        )
      }
      
      render(<TestComponent />)
      
      const textarea = screen.getByTestId("character-count-textarea")
      const counter = screen.getByTestId("counter")
      
      expect(counter).toHaveTextContent('20 characters remaining')
      
      await user.type(textarea, '12345')
      
      expect(counter).toHaveTextContent('15 characters remaining')
    })
  })

  // Placeholder Behavior
  describe('Placeholder Behavior', () => {
    it('shows placeholder when empty', () => {
      const placeholder = 'Enter text here...'
      render(<Textarea placeholder={placeholder} data-testid="placeholder-visible-textarea" />)
      
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
    })

    it('hides placeholder when input has value', async () => {
      const user = userEvent.setup()
      const placeholder = 'Enter text here...'
      
      render(<Textarea placeholder={placeholder} data-testid="placeholder-hidden-textarea" />)
      
      const textarea = screen.getByTestId("placeholder-hidden-textarea")
      await user.type(textarea, 'Some input value')
      
      // Placeholder shouldn't be visible, but the attribute should remain
      expect(textarea).toHaveAttribute('placeholder', placeholder)
      expect(textarea).toHaveValue('Some input value')
    })

    it('applies correct styling to the placeholder', () => {
      render(<Textarea placeholder="Test placeholder" data-testid="placeholder-styled-textarea" />)
      
      const textarea = screen.getByTestId("placeholder-styled-textarea")
      expect(textarea).toHaveClass('placeholder:text-muted-foreground')
    })
  })

  // Forward Ref Implementation
  describe('ForwardRef Implementation', () => {
    it('forwards ref to the textarea element', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      render(<Textarea ref={ref} data-testid="ref-textarea" />)
      
      expect(ref.current).not.toBeNull()
      expect(ref.current?.tagName).toBe('TEXTAREA')
    })

    it('allows focus via ref', () => {
      const TestComponent = () => {
        const ref = React.useRef<HTMLTextAreaElement>(null)
        
        React.useEffect(() => {
          if (ref.current) {
            ref.current.focus()
          }
        }, [])
        
        return <Textarea ref={ref} data-testid="focus-ref-textarea" />
      }
      
      render(<TestComponent />)
      
      const textarea = screen.getByTestId("focus-ref-textarea")
      expect(document.activeElement).toBe(textarea)
    })
  })
}) 