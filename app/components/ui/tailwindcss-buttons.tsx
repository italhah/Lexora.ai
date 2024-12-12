import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonsCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function ButtonsCard({ label = "Border Magic", className, ...props }: ButtonsCardProps) {
  return (
    <button
      className={cn(
        "relative inline-flex lg:h-10 md:h-8 sm:h-8 xs:h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800",
        className
      )}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#393bb2_0%,#22236b_50%,#393bb2_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 xs:text-xs sm:text-xs  md:text-sm lg:text-sm font-medium text-white backdrop-blur-3xl">
        {label}
      </span>
    </button>
  );
}