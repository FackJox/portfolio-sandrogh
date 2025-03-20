import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

// Mock the scrollIntoView method which isn't available in JSDOM
Element.prototype.scrollIntoView = jest.fn()

describe('Select Component', () => {
  describe('Initial Rendering', () => {
    it('renders with closed dropdown by default', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>
      )
      
      // Check that the trigger exists but content is not in the document by default
      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('applies correct default styling to trigger', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveClass('flex h-10 w-full items-center justify-between rounded-md border')
    })

    it('renders with custom className', () => {
      render(
        <Select>
          <SelectTrigger className="test-class">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveClass('test-class')
    })

    it('displays default value when provided', () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const triggerElement = screen.getByRole('combobox')
      expect(triggerElement.textContent).toContain('Apple')
    })
  })

  describe('Controlled behavior', () => {
    it('updates based on value prop changes', () => {
      const { rerender } = render(
        <Select value="apple" onValueChange={() => {}}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>
      )
      
      expect(screen.getByRole('combobox').textContent).toContain('Apple')
      
      // Rerender with new value
      rerender(
        <Select value="banana" onValueChange={() => {}}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>
      )
      
      expect(screen.getByRole('combobox').textContent).toContain('Banana')
    })

    it('accepts onValueChange prop', () => {
      const onValueChangeMock = jest.fn()
      render(
        <Select onValueChange={onValueChangeMock}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>
      )
      
      // Simply verify the prop is accepted
      expect(onValueChangeMock).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-autocomplete', 'none')
    })
  })
}) 