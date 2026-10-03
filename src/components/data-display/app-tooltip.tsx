import React from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface AppTooltipProps {
    text: string | React.ReactNode
    disabled?: boolean;
    children: React.ReactNode
    side?: "top" | "right" | "bottom" | "left"
}

export const AppTooltip: React.FC<AppTooltipProps> = ({
    text,
    children,
    disabled,
    side = "bottom",
}) => {
    return (
        <Tooltip>
            <TooltipTrigger disabled={disabled} asChild>{children}</TooltipTrigger>
            {!disabled && <TooltipContent side={side}>
                <p>{text}</p>
            </TooltipContent>}
        </Tooltip>
    )
}
