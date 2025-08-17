"use client";
import React from "react";
import { builder_textbox as Textarea } from "./builder_textbox";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  MousePointer,
  MessageSquare,
  Code,
  Send,
  Wand2
} from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import { useTypewriter, DEFAULT_PHRASES, DEFAULT_TYPING_SPEED, DEFAULT_DELETING_SPEED, DEFAULT_PAUSE } from "@/lib/useTypewriter";

interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  showCounter?: boolean;
  autoGrow?: boolean;
  onEnhancePrompt?: () => void;
  onSelectAll?: () => void;
  onSend?: (text: string) => void;
  mode?: 'chat' | 'builder';
  onModeToggle?: (mode: 'chat' | 'builder') => void;
  // Typewriter placeholder customization
  phrases?: string[];
  typingSpeed?: number; // ms per char
  deletingSpeed?: number; // ms per char when deleting
  pause?: number; // pause after full phrase in ms
}

function EnhancedTextarea({
  label,
  helperText,
  showCounter,
  autoGrow,
  className,
  maxLength,
  onEnhancePrompt,
  onSelectAll,
  onSend,
  mode = 'chat',
  onModeToggle,
  ...props
}: EnhancedTextareaProps) {
  // normalize initial value to string
  const initialValue = React.useMemo(() => {
    if (typeof props.value === 'string') return props.value;
    if (Array.isArray(props.value)) return props.value.join('');
    if (props.value === undefined || props.value === null) return '';
    return String(props.value);
  }, [props.value]);
  const [value, setValue] = React.useState<string>(initialValue);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  // Typewriter placeholder state
  const phrases = props.phrases && props.phrases.length > 0 ? props.phrases : DEFAULT_PHRASES;
  const typingSpeed = typeof props.typingSpeed === 'number' ? props.typingSpeed : DEFAULT_TYPING_SPEED;
  const deletingSpeed = typeof props.deletingSpeed === 'number' ? props.deletingSpeed : DEFAULT_DELETING_SPEED;
  const pause = typeof props.pause === 'number' ? props.pause : DEFAULT_PAUSE;

  const { displayed: displayedPlaceholder } = useTypewriter({
    phrases,
    typingSpeed,
    deletingSpeed,
    pause,
    active: !isFocused && (!value || value.length === 0),
  });

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

  // typewriter behavior is now handled by useTypewriter hook above

  const handleFocusLocal = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlurLocal = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  const handleSelectAll = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      if (onSelectAll) onSelectAll();
    }
  };

  const handleSend = () => {
    if (onSend) {
      onSend(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  const currentLength = value.length;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-white/90">
          {label}
        </label>
      )}
      
      <div className="relative">
          <Textarea
          ref={textareaRef}
          className={cn("pb-10", className)} // Add bottom padding for send button
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={maxLength}
          style={{ resize: "none" }}
          {...props}
          onFocus={handleFocusLocal}
          onBlur={handleBlurLocal}
          placeholder={isFocused ? (props.placeholder || "") : ""}
        />

        {/* Animated placeholder overlay with caret when not focused and textarea empty */}
        {!isFocused && (!value || value.length === 0) && displayedPlaceholder && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-start px-4 py-3 text-xs text-white/60">
            <span className="truncate">{displayedPlaceholder}</span>
            <span className="typewriter-caret" />
          </div>
        )}
        
        {/* Bottom-left buttons */}
        <div className="absolute bottom-2 left-2 flex items-end gap-1">
          {/* Mode toggle button */}
          {onModeToggle && (
            <IconButton
              onClick={() => onModeToggle(mode === 'chat' ? 'builder' : 'chat')}
              aria-label={`Switch to ${mode === 'chat' ? 'Builder' : 'Chat'} mode`}
              title={`Switch to ${mode === 'chat' ? 'Builder' : 'Chat'} mode`}
              icon={mode === 'chat' ? <MessageSquare className="h-3 w-3" /> : <Code className="h-3 w-3" />}
            />
          )}
          
          {/* Enhance prompt button */}
          {onEnhancePrompt && (
            <IconButton
              onClick={onEnhancePrompt}
              aria-label="Enhance prompt with AI"
              title="Enhance prompt with AI"
              icon={<Wand2 className="h-3 w-3" />}
            />
          )}
          
          {/* Select all button */}
          {onSelectAll && (
            <IconButton
              onClick={handleSelectAll}
              aria-label="Select all text"
              title="Select all text"
              icon={<MousePointer className="h-3 w-3" />}
            />
          )}
        </div>
        
        {/* Send button - positioned at bottom right */}
        {onSend && (
          <IconButton
            onClick={handleSend}
            aria-label="Send message"
            title="Send message (Ctrl+Enter)"
            icon={<Send className="h-3.5 w-3.5" />}
            className={cn(
              "absolute bottom-2 right-2 p-1.5",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
            disabled={!value || value.trim().length === 0}
          />
        )}
      </div>
      
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
  const [mode, setMode] = React.useState<'chat' | 'builder'>('chat');
  
  const handleEnhancePrompt = () => {
    console.log('Enhancing prompt...');
    // TODO: Implement AI prompt enhancement
  };
  
  const handleSelectAll = () => {
    console.log('Selected all text');
  };
  
  const handleSend = (text: string) => {
    console.log('Sending message:', text);
    // TODO: Implement send functionality
  };
  
  const handleModeToggle = (newMode: 'chat' | 'builder') => {
    setMode(newMode);
    console.log('Mode switched to:', newMode);
  };

  return (
    <>
    <div className="flex flex-col gap-4 w-[500px] ">
      <section className="space-y-4">
       {/* <h2 className="text-lg font-semibold text-white/90">
         AI Chat Interface
        </h2> */}
        <EnhancedTextarea
          className="max-w-xl w-full"
          label=""
          placeholder="Describe what you want to build..."
          maxLength={500}
          showCounter
          autoGrow
          helperText="Use Ctrl+Enter to send"
          mode={mode}
          onEnhancePrompt={handleEnhancePrompt}
          onSelectAll={handleSelectAll}
          onSend={handleSend}
          onModeToggle={handleModeToggle}
        />
      </section>
      </div>
    </>
  );
}
