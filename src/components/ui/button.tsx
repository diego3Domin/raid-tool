import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-bold uppercase tracking-wide transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-[#C8963E]",
  {
    variants: {
      variant: {
        default: "bg-[#C8963E] text-[#0A0A0F] border border-[#C8963E] hover:bg-[#9A6E25] active:bg-[#7A5620]",
        destructive:
          "bg-[#8B1A1A] text-[#E8E4DF] border border-[#8B1A1A] hover:bg-[#B42828] active:bg-[#6B1515]",
        outline:
          "border border-[#2A2A30] bg-transparent text-[#7A7570] hover:border-[#C8963E]/60 hover:text-[#C8963E] active:border-[#C8963E]",
        secondary:
          "bg-[#4A5568] text-[#E8E4DF] border border-[#4A5568] hover:bg-[#64748B] active:bg-[#3A4558]",
        ghost:
          "hover:bg-[#1A1A20] hover:text-[#C8963E] transition-colors",
        link: "text-[#C8963E] underline-offset-4 hover:underline hover:text-[#9A6E25] normal-case tracking-normal font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-sm px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-11 rounded-sm px-6 text-base has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
