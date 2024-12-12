import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        "w-full min-h-[100px] resize-none rounded-lg bg-zinc-800 px-4 py-3",
        "text-sm text-white whitespace-pre-wrap break-words",
        "placeholder:text-zinc-500 placeholder:break-words",
        "border border-zinc-700",
        "focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40",
        className
      )}
      {...props}
    />
  );
}