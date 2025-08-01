import React, { forwardRef } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

export const WithTooltip = forwardRef<
HTMLButtonElement,
React.ComponentPropsWithoutRef<"button">
>(({ children, ...props }, ref) => {
return (
<Tooltip>
<TooltipTrigger asChild>
<button ref={ref} {...props}>
{children}
</button>
</TooltipTrigger>
<TooltipContent>{props["aria-label"]}</TooltipContent>
</Tooltip>
)
})
WithTooltip.displayName = "WithTooltip"
