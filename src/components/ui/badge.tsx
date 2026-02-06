import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border px-2 py-1 text-xs font-bold uppercase tracking-wide w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-1 focus-visible:ring-[#C8963E] transition-all duration-150 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[#C8963E] text-[#0A0A0F] border-[#C8963E]",
        secondary:
          "bg-[#4A5568] text-[#E8E4DF] border-[#4A5568]",
        destructive:
          "bg-[#8B1A1A] text-[#E8E4DF] border-[#8B1A1A]",
        outline:
          "border border-[#2A2A30] bg-transparent text-[#7A7570]",
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
