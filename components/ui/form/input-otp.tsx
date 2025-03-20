"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  
  // Add validation checks
  const isContextValid = !!inputOTPContext
  const areSlotsValid = isContextValid && Array.isArray(inputOTPContext.slots)
  const isIndexValid = areSlotsValid && index >= 0 && index < inputOTPContext.slots.length
  
  // Provide fallback values when validation fails
  const char = isIndexValid ? inputOTPContext.slots[index].char : ""
  const hasFakeCaret = isIndexValid ? inputOTPContext.slots[index].hasFakeCaret : false
  const isActive = isIndexValid ? inputOTPContext.slots[index].isActive : false
  
  // Add console warnings in development mode
  if (process.env.NODE_ENV === "development") {
    if (!isContextValid) {
      console.warn("InputOTPSlot: OTPInputContext is not available. Make sure to use this component inside an InputOTP component.")
    } else if (!areSlotsValid) {
      console.warn("InputOTPSlot: OTPInputContext.slots is not valid. Expected an array.")
    } else if (!isIndexValid) {
      console.warn(`InputOTPSlot: Invalid index ${index}. Must be between 0 and ${inputOTPContext.slots.length - 1}.`)
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      role="textbox"
      aria-live="polite"
      aria-label={`Digit ${index + 1}`}
      aria-current={isActive ? "step" : undefined}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
