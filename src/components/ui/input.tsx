import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#7A7570] selection:bg-[#C8963E] selection:text-[#0A0A0F] bg-[#0A0A0F] border-[#2A2A30] h-10 w-full min-w-0 rounded-sm border-2 px-4 py-2 text-base font-medium text-[#E8E4DF] transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(0,0,0,0.8)]",
        "focus-visible:border-[#C8963E] focus-visible:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_8px_rgba(200,150,62,0.3)] focus-visible:ring-0",
        "hover:border-[#4A5568]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
