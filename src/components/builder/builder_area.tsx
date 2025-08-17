"use client";
import React from "react";
import { builder_textbox as Textarea } from "./builder_textbox";
import { cn } from "@/lib/utils";

interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  showCounter?: boolean;
  autoGrow?: boolean;
}

function EnhancedTextarea({
  label,
  helperText,
  showCounter,
  autoGrow,
  className,
  maxLength,
  ...props
}: EnhancedTextareaProps) {
  const [value, setValue] = React.useState(props.value || "");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }

    // Auto-grow functionality
    if (autoGrow && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  React.useEffect(() => {
    if (autoGrow && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [autoGrow]);

  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-white/90">
          {label}
        </label>
      )}
      <Textarea
        ref={textareaRef}
        className={cn(className)}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        style={{resize: "none"}}
        {...props}
      />
      <div className="flex justify-between text-xs text-white/60">
        {helperText && <span>{helperText}</span>}
        {showCounter && maxLength && (
          <span className={cn(
            "ml-auto",
            currentLength > maxLength * 0.9 && "text-yellow-400",
            currentLength >= maxLength && "text-red-400"
          )}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export function builder_area() {
  return (
    <>
    <div className="flex flex-col gap-4 w-[500px] ">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white/90">
          With Counter + AutoGrow
        </h2>
        <EnhancedTextarea
          className="max-w-xl w-full"
          label="Bio"
          placeholder="Write a short bio..."
          maxLength={200}
          showCounter
          autoGrow
          helperText="Max 200 characters"
        />
      </section>
      </div>
    </>
  );
}
