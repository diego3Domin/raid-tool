import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border-2 px-2.5 py-1 text-xs font-bold uppercase tracking-wide w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-[#C8963E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F] transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-[#D4A43C] to-[#C8963E] text-[#0A0A0F] border-[#9A6E25] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]",
        secondary:
          "bg-gradient-to-b from-[#64748B] to-[#4A5568] text-[#E8E4DF] border-[#3A4558] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
        destructive:
          "bg-gradient-to-b from-[#B42828] to-[#8B1A1A] text-[#E8E4DF] border-[#6B1515] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
        outline:
          "border-2 border-[#2A2A30] bg-[#0A0A0F] text-[#7A7570] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]",
        ghost: "border-transparent text-[#7A7570]",
        link: "text-[#C8963E] underline-offset-4 border-transparent normal-case tracking-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
