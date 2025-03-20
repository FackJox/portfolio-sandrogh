'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

interface ExtendedThemeProviderProps extends ThemeProviderProps {
  disableScript?: boolean
}

export function ThemeProvider({ 
  children, 
  disableScript = false, 
  ...props 
}: ExtendedThemeProviderProps) {
  return (
    <NextThemesProvider 
      {...props}
      // Use disableScript to prevent theme script injection in tests
      enableScript={!disableScript}
    >
      {children}
    </NextThemesProvider>
  )
}
