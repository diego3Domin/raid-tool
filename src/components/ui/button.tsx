import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-bold uppercase tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#C8963E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-[#D4A43C] to-[#C8963E] text-[#0A0A0F] border-2 border-[#9A6E25] hover:from-[#E8C460] hover:to-[#D4A43C] hover:shadow-[0_0_12px_rgba(200,150,62,0.4),0_0_24px_rgba(200,150,62,0.15)] active:from-[#9A6E25] active:to-[#7A5620] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]",
        destructive:
          "bg-gradient-to-b from-[#B42828] to-[#8B1A1A] text-[#E8E4DF] border-2 border-[#6B1515] hover:from-[#D63333] hover:to-[#B42828] hover:shadow-[0_0_12px_rgba(139,26,26,0.4)] active:from-[#6B1515] active:to-[#5B1212] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
        outline:
          "border-2 border-[#2A2A30] bg-[#141418] text-[#7A7570] hover:border-[#C8963E]/60 hover:text-[#C8963E] hover:bg-[#1A1A20] hover:shadow-[inset_0_0_8px_rgba(200,150,62,0.1)] active:border-[#C8963E] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]",
        secondary:
          "bg-gradient-to-b from-[#64748B] to-[#4A5568] text-[#E8E4DF] border-2 border-[#3A4558] hover:from-[#7A8BA0] hover:to-[#64748B] active:from-[#3A4558] active:to-[#2A3548] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
        ghost:
          "hover:bg-[#1A1A20] hover:text-[#C8963E] transition-colors",
        link: "text-[#C8963E] underline-offset-4 hover:underline hover:text-[#9A6E25] normal-case tracking-normal font-semibold",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        xs: "h-6 gap-1 rounded-sm px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-sm px-7 text-base has-[>svg]:px-5",
        icon: "size-10",
        "icon-xs": "size-6 rounded-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
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
