import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label: string;
  error?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex items-start">
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer h-5 w-5 shrink-0 rounded border border-gray-300 bg-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#2DD4BF] data-[state=checked]:border-[#2DD4BF] data-[state=checked]:text-white transition-all duration-200",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <div className="ml-3 text-sm leading-none">
        <label
          htmlFor={props.id}
          className="font-medium text-gray-700 cursor-pointer select-none"
        >
          {label}
        </label>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
