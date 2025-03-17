"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SelectContextValue = {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select")
  }
  return context
}

export interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children?: React.ReactNode
}

function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  const { value, setOpen, open } = useSelectContext()

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md bg-white px-3 py-2 text-sm focus:outline-none",
        className,
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`ml-2 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
}

function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = useSelectContext()

  return <span>{value || placeholder}</span>
}

interface SelectContentProps {
  className?: string
  children?: React.ReactNode
}

function SelectContent({ className, children }: SelectContentProps) {
  const { open, setOpen } = useSelectContext()

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
      <div
        className={cn("absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg", className)}
      >
        {children}
      </div>
    </>
  )
}

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  className?: string
}

function SelectItem({ className, children, value, ...props }: SelectItemProps) {
  const { onValueChange, setOpen } = useSelectContext()

  const handleClick = () => {
    onValueChange(value)
    setOpen(false)
  }

  return (
    <button
      className={cn(
        "relative flex w-full cursor-default select-none items-center py-1.5 px-3 text-sm outline-none hover:bg-blue-50",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

