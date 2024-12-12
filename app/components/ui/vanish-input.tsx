"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const VanishInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        {...props}
        className={cn(
          "w-full bg-transparent text-white border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer",
          isFocused && "placeholder-transparent",
          className
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== "");
        }}
        onChange={(e) => setHasValue(e.target.value !== "")}
      />
      <label
        className={cn(
          "absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6",
          (isFocused || hasValue) && "-translate-y-6 scale-75"
        )}
      >
        {props.placeholder}
      </label>
    </div>
  );
});

VanishInput.displayName = "VanishInput";


