"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@/components/ui/checkbox";
import { cn } from "@/utils";

interface CheckboxProps extends Omit<React.ComponentProps<typeof CheckboxPrimitive>, 'onCheckedChange'> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({ 
  label, 
  checked, 
  onCheckedChange, 
  className,
  ...props 
}: CheckboxProps) {
  const handleCheckedChange = React.useCallback((checked: boolean | "indeterminate") => {
    if (onCheckedChange) {
      onCheckedChange(checked === true);
    }
  }, [onCheckedChange]);

  if (label) {
    return (
      <label className={cn("flex items-center gap-2 cursor-pointer", className)}>
        <CheckboxPrimitive
          checked={checked}
          onCheckedChange={handleCheckedChange}
          {...props}
        />
        <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
          {label}
        </span>
      </label>
    );
  }

  return (
    <CheckboxPrimitive
      checked={checked}
      onCheckedChange={handleCheckedChange}
      className={className}
      {...props}
    />
  );
}

