import * as React from "react"

const MOBILE_BREAKPOINT = 768
const DEBOUNCE_DELAY = 250 // milliseconds

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Debounced handler for resize events
    const onChange = debounce(() => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }, DEBOUNCE_DELAY)
    
    mql.addEventListener("change", onChange)
    
    // Initial check without debounce
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile ?? false
}
