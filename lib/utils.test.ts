import { cn } from './utils'

describe('cn utility function', () => {
  // Test basic concatenation of class names
  it('should concatenate basic class names', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
  })

  // Test conditional class application
  it('should apply conditional classes', () => {
    expect(cn('base-class', { 'text-red-500': true, 'text-blue-500': false }))
      .toBe('base-class text-red-500')
  })

  // Test array of class names
  it('should handle array of class names', () => {
    expect(cn(['text-red-500', 'bg-blue-500'])).toBe('text-red-500 bg-blue-500')
  })

  // Test nested arrays
  it('should handle nested arrays', () => {
    expect(cn(['text-red-500', ['bg-blue-500', 'p-4']]))
      .toBe('text-red-500 bg-blue-500 p-4')
  })

  // Test with undefined and null values
  it('should handle undefined and null values', () => {
    expect(cn('base-class', undefined, null)).toBe('base-class')
  })

  // Test with boolean conditions
  it('should handle boolean conditions', () => {
    expect(cn('base-class', true && 'text-red-500', false && 'text-blue-500'))
      .toBe('base-class text-red-500')
  })

  // Test with complex combinations
  it('should handle complex combinations', () => {
    expect(cn(
      'base-class',
      ['text-red-500', 'bg-blue-500'],
      { 'p-4': true, 'm-4': false },
      undefined,
      null,
      true && 'rounded-lg',
      false && 'shadow-lg'
    )).toBe('base-class text-red-500 bg-blue-500 p-4 rounded-lg')
  })

  // Test Tailwind class merging
  it('should properly merge Tailwind classes', () => {
    expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500')
    expect(cn('p-4 p-6')).toBe('p-6')
  })

  // Test with empty strings
  it('should handle empty strings', () => {
    expect(cn('base-class', '')).toBe('base-class')
  })

  // Test with multiple conditional objects
  it('should handle multiple conditional objects', () => {
    expect(cn(
      { 'text-red-500': true },
      { 'bg-blue-500': true },
      { 'p-4': false }
    )).toBe('text-red-500 bg-blue-500')
  })
}) 