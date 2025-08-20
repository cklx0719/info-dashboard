import * as React from "react";
import { cn } from "~/lib/utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
  languages?: any[];
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}>({});

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div ref={selectRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);
  
  return (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen?.(!isOpen)}
      {...props}
    >
      {children}
      <svg
        className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder, languages }: SelectValueProps) => {
  const { value } = React.useContext(SelectContext);
  
  // 获取显示值
  const getDisplayValue = () => {
    if (!value) return placeholder;
    if (value === 'auto') return '自动检测';
    
    // 如果提供了languages数组，查找对应的label
    if (languages && languages.length > 0) {
      const lang = languages.find((l: any) => l.code === value);
      if (lang) return lang.label;
    }
    
    return value;
  };
  
  return (
    <span className="block truncate">
      {getDisplayValue()}
    </span>
  );
};

const SelectContent = ({ children }: SelectContentProps) => {
  const { isOpen } = React.useContext(SelectContext);
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
      {children}
    </div>
  );
};

const SelectItem = ({ value, children }: SelectItemProps) => {
  const { onValueChange, setIsOpen } = React.useContext(SelectContext);
  
  return (
    <div
      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
      onClick={() => {
        onValueChange?.(value);
        setIsOpen?.(false);
      }}
    >
      {children}
    </div>
  );
};

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
};