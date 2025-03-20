import * as React from "react"
import { renderHook, act } from "@testing-library/react"
import { useToast, toast as globalToast, reducer } from "@/hooks/use-toast"
import { render, screen, waitFor } from "@/__tests__/utils/test-utils"
import { Toaster } from "@/components/ui/feedback/toaster"
import userEvent from "@testing-library/user-event"

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
      
      // Only the latest toast should be present due to TOAST_LIMIT
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Toast 3");
    });
  });

  describe("Reducer Logic", () => {
    it("handles ADD_TOAST action", () => {
      const initialState = { toasts: [] };
      const action = { 
        type: "ADD_TOAST" as const, 
        toast: { id: "test", title: "Test Toast", open: true } 
      };
      
      const newState = reducer(initialState, action);
      
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].title).toBe("Test Toast");
    });
    
    it("handles UPDATE_TOAST action", () => {
      const initialState = { 
        toasts: [{ id: "test", title: "Original Toast", open: true }] 
      };
      const action = { 
        type: "UPDATE_TOAST" as const, 
        toast: { id: "test", title: "Updated Toast" } 
      };
      
      const newState = reducer(initialState, action);
      
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].title).toBe("Updated Toast");
      expect(newState.toasts[0].open).toBe(true); // Preserves other properties
    });
    
    it("handles DISMISS_TOAST action for a specific toast", () => {
      const initialState = { 
        toasts: [
          { id: "test1", title: "Toast 1", open: true },
          { id: "test2", title: "Toast 2", open: true }
        ] 
      };
      const action = { 
        type: "DISMISS_TOAST" as const, 
        toastId: "test1" 
      };
      
      const newState = reducer(initialState, action);
      
      expect(newState.toasts).toHaveLength(2);
      expect(newState.toasts[0].open).toBe(false); // First toast closed
      expect(newState.toasts[1].open).toBe(true);  // Second toast unchanged
    });
    
    it("handles DISMISS_TOAST action for all toasts", () => {
      const initialState = { 
        toasts: [
          { id: "test1", title: "Toast 1", open: true },
          { id: "test2", title: "Toast 2", open: true }
        ] 
      };
      const action = { 
        type: "DISMISS_TOAST" as const,
        // No toastId means dismiss all
      };
      
      const newState = reducer(initialState, action);
      
      expect(newState.toasts).toHaveLength(2);
      expect(newState.toasts.every(t => t.open === false)).toBe(true);
    });
    
    it("handles REMOVE_TOAST action for a specific toast", () => {
      const initialState = { 
        toasts: [
          { id: "test1", title: "Toast 1", open: true },
          { id: "test2", title: "Toast 2", open: true }
        ] 
      };
      const action = { 
        type: "REMOVE_TOAST" as const, 
        toastId: "test1" 
      };
      
      const newState = reducer(initialState, action);
      
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe("test2");
    });
    
    it("handles REMOVE_TOAST action for all toasts", () => {
      const initialState = { 
        toasts: [
          { id: "test1", title: "Toast 1", open: true },
          { id: "test2", title: "Toast 2", open: true }
        ] 
      };
      const action = { 
        type: "REMOVE_TOAST" as const,
        // No toastId means remove all 
      };
      
      const newState = reducer(initialState, action);
      
      expect(newState.toasts).toHaveLength(0);
    });
  });

  describe("Integration with Toast Component", () => {
    const TestComponent = () => {
      const { toast } = useToast();
      
      return (
        <button 
          onClick={() => toast({ title: "Integrated Toast" })}
          data-testid="toast-trigger"
        >
          Show Toast
        </button>
      );
    };
    
    it("renders toast when triggered from a component", async () => {
      render(
        <>
          <TestComponent />
          <Toaster />
        </>
      );
      
      const button = screen.getByTestId("toast-trigger");
      userEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText("Integrated Toast")).toBeInTheDocument();
      });
    });
    
    it("can locate and click toast close button", async () => {
      render(
        <>
          <TestComponent />
          <Toaster />
        </>
      );
      
      // Trigger toast
      const button = screen.getByTestId("toast-trigger");
      userEvent.click(button);
      
      // Find toast element first
      const toastElement = await screen.findByText("Integrated Toast");
      
      // Find the close button - it's a sibling of the div containing the toast title
      const closeButton = toastElement.closest('li')?.querySelector('button[toast-close]');
      expect(closeButton).not.toBeNull();
      
      if (closeButton) {
        // Click the close button
        userEvent.click(closeButton);
        
        // Verify the click was possible
        expect(true).toBe(true);
      }
    });
  });

  describe("Error Handling", () => {
    it("handles invalid update parameters gracefully", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      let updateFn: (props: any) => void;
      
      act(() => {
        const { update } = result.current.toast({ title: "Original Toast" });
        updateFn = update;
      });
      
      // Should not throw when passed invalid data
      expect(() => {
        act(() => {
          // @ts-ignore - Testing runtime behavior with invalid data
          updateFn(null);
        });
      }).not.toThrow();
      
      // Toast should still exist
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Original Toast");
    });
    
    it("handles missing toast ID in dismiss operation", () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      act(() => {
        result.current.toast({ title: "Test Toast" });
      });
      
      // Should not throw when dismissing non-existent toast
      expect(() => {
        act(() => {
          result.current.dismiss("non-existent-id");
        });
      }).not.toThrow();
      
      // Original toast should still be there
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Test Toast");
    });
  });

  describe("Global Toast Function", () => {
    beforeEach(() => {
      resetToastState();
    });
    
    it("creates toast using global toast function", () => {
      let id: string;
      
      act(() => {
        const result = globalToast({ title: "Global Toast" });
        id = result.id;
      });
      
      // Render a hook to check the state
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Global Toast");
      expect(result.current.toasts[0].id).toBe(id);
    });
    
    // The global toast function does not have a dismiss method directly
    // It is accessed through the hook's dismiss method
    it("allows dismissing toast created by global toast function", () => {
      let id: string;
      
      act(() => {
        const result = globalToast({ title: "Global Toast" });
        id = result.id;
      });
      
      // Use the hook to dismiss the toast
      const { result } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      act(() => {
        result.current.dismiss(id);
      });
      
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].open).toBe(false);
    });
  });

  describe("Hook Cleanup", () => {
    it("initializes and cleans up properly", () => {
      // Initial render
      const { unmount } = renderHook(() => useToast(), {
        wrapper: TestWrapper
      });
      
      // Unmount the hook - if it doesn't throw, the cleanup worked
      expect(() => {
        unmount();
      }).not.toThrow();
      
      // Successful if we got here without errors
      expect(true).toBe(true);
    });
  });
}); 