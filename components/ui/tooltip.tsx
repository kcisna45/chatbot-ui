"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export const TooltipProvider = TooltipPrimitive.Provider

export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = forwardRef<
React.ElementRef<typeof TooltipPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
<TooltipPrimitive.Content
ref={ref}
sideOffset={sideOffset}
className={cn(
"z-50 overflow-hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-50",
className
)}
{...props}
/>
))

TooltipContent.displayName = TooltipPrimitive.Content.displayName

