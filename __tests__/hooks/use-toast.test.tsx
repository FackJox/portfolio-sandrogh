import * as React from "react"
import { renderHook, act } from "@testing-library/react"
import { useToast, toast as globalToast } from "@/hooks/use-toast"

// Mock pointer events API methods not implemented in JSDOM
beforeAll(() => {
  // Mock hasPointerCapture
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = jest.fn(() => false);
  }
  
  // Mock setPointerCapture
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = jest.fn();
  }
  
  // Mock releasePointerCapture
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = jest.fn();
  }
})

// Clean up mocks after tests
afterAll(() => {
  // Clean up hasPointerCapture mock
  if (Element.prototype.hasPointerCapture.mock) {
    delete Element.prototype.hasPointerCapture;
  }
  
  // Clean up setPointerCapture mock
  if (Element.prototype.setPointerCapture.mock) {
    delete Element.prototype.setPointerCapture;
  }
  
  // Clean up releasePointerCapture mock
  if (Element.prototype.releasePointerCapture.mock) {
    delete Element.prototype.releasePointerCapture;
  }
})

// Direct access to the internals of the toast module
const getToastState = () => {
  const memoryStateModule = require('@/hooks/use-toast');
  // Access the memoryState that contains all toast data
  return memoryStateModule.reducer(
    { toasts: [] }, 
    { type: "ADD_TOAST", toast: { id: "test", title: "test", open: true } }
  );
};

// Reset toast state between tests
const resetToastState = () => {
  // Directly modify the internal memory state of the useToast hook
  const module = require('@/hooks/use-toast');
  if (module.memoryState) {
    module.memoryState.toasts = [];
  }
  
  // Also call dismiss from the global toast function
  if (typeof globalToast.dismiss === 'function') {
    globalToast.dismiss();
  }
};

// Custom wrapper component to properly use hooks
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

describe("useToast Hook", () => {
  // Reset toast state between tests
  beforeEach(() => {
    resetToastState();
    jest.clearAllMocks();
  });

  describe("Toast State Management", () => {
    it("returns empty toast array by default", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      expect(result.current.toasts).toEqual([]);
    });

    it("adds toast to the state", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      act(() => {
        result.current.toast({ title: "Test Toast" });
      });
      
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Test Toast");
    });

    it("adds toast with all properties", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      act(() => {
        result.current.toast({
          title: "Full Toast",
          description: "This is a complete toast",
          variant: "destructive",
          action: <button>Action</button>
        });
      });
      
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Full Toast");
      expect(result.current.toasts[0].description).toBe("This is a complete toast");
      expect(result.current.toasts[0].variant).toBe("destructive");
      expect(result.current.toasts[0].action).toBeDefined();
    });

    it("removes toast when dismissed", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      let toastId: string;
      
      act(() => {
        const { id } = result.current.toast({ title: "Dismiss Test Toast" });
        toastId = id;
      });
      
      expect(result.current.toasts).toHaveLength(1);
      
      act(() => {
        result.current.dismiss(toastId);
      });
      
      // Toast should first be marked as closed but still in the array
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].open).toBe(false);
    });

    it("updates existing toast", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      let updateFn: (props: any) => void;
      
      act(() => {
        const { update } = result.current.toast({ title: "Original Title" });
        updateFn = update;
        
        // Update the toast
        updateFn({ title: "Updated Title", description: "New description" });
      });
      
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Updated Title");
      expect(result.current.toasts[0].description).toBe("New description");
    });
  });

  describe("Toast API", () => {
    it("returns toast function with dispatch methods", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      expect(typeof result.current.toast).toBe("function");
      expect(typeof result.current.dismiss).toBe("function");
    });

    it("returns created toast ID", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      let id: string;
      
      act(() => {
        id = result.current.toast({ title: "Test Toast" }).id;
      });
      
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("dismisses a specific toast by ID", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      let firstId: string;
      let secondId: string;
      
      act(() => {
        resetToastState(); // Ensure clean state
        firstId = result.current.toast({ title: "First Toast" }).id;
        secondId = result.current.toast({ title: "Second Toast" }).id;
      });
      
      // Because of TOAST_LIMIT, only the most recent toast will be in the array
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Second Toast");
      
      act(() => {
        result.current.dismiss(secondId);
      });
      
      // Toast should be closed
      expect(result.current.toasts[0].open).toBe(false);
    });

    it("dismisses all toasts when no ID provided", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      // Reset state before adding toasts
      act(() => {
        resetToastState();
        
        // Due to TOAST_LIMIT, only the last toast remains
        result.current.toast({ title: "Toast 3" });
      });
      
      expect(result.current.toasts).toHaveLength(1);
      
      act(() => {
        result.current.dismiss();
      });
      
      // All toasts should be closed
      expect(result.current.toasts.every(t => t.open === false)).toBe(true);
    });
  });

  describe("Toast Limit", () => {
    it("limits the number of toasts according to TOAST_LIMIT", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      // Create more toasts than the limit allows
      // TOAST_LIMIT is set to 1 in the implementation
      act(() => {
        resetToastState();
        result.current.toast({ title: "Toast 1" });
        result.current.toast({ title: "Toast 2" });
        result.current.toast({ title: "Toast 3" });
      });
      
      // Should only keep most recent toast
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Toast 3");
    });
  });

  describe("onOpenChange Handler", () => {
    it("dismisses toast when onOpenChange is called with false", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      act(() => {
        resetToastState();
        result.current.toast({ title: "OnOpenChange Test" });
      });
      
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].open).toBe(true);
      
      // Simulate the toast's onOpenChange being called with false
      act(() => {
        if (result.current.toasts[0].onOpenChange) {
          result.current.toasts[0].onOpenChange(false);
        }
      });
      
      // Toast should be marked as closed
      expect(result.current.toasts[0].open).toBe(false);
    });
  });
}); 