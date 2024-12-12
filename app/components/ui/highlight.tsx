import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = div.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseXRef.current = x;
      mouseYRef.current = y;
      
      div.style.setProperty("--mouse-x", `${x}px`);
      div.style.setProperty("--mouse-y", `${y}px`);
    };

    div.addEventListener("mousemove", handleMouseMove);
    return () => div.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={divRef}
      className={cn(
        "relative h-full w-full rounded-[--radius] bg-neutral-950 p-[--padding] [--padding:1px] [--radius:0.75rem] before:pointer-events-none before:absolute before:inset-[--padding] before:rounded-[calc(var(--radius)-var(--padding))] before:bg-neutral-800/40 dark:before:bg-neutral-800/40",
        "after:pointer-events-none after:absolute after:inset-[--padding] after:rounded-[calc(var(--radius)-var(--padding))] after:bg-[radial-gradient(450px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.06),transparent_40%)]",
        className
      )}
    >
      {children}
    </div>
  );
};