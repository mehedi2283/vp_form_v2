import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../../lib/utils";

export interface RadioGroupProps {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, label, error, options, name, value, onChange, ...props }, ref) => {
    return (
      <div className={cn("w-full", className)} ref={ref}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {label}
          </label>
        )}
        <RadioGroupPrimitive.Root
          className="flex flex-col gap-3"
          value={value}
          onValueChange={onChange}
          name={name}
          {...props}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <RadioGroupPrimitive.Item
                value={option.value}
                id={`${name}-${option.value}`}
                className={cn(
                  "aspect-square h-5 w-5 rounded-full border border-gray-300 bg-white text-white shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer",
                  value === option.value && "border-[#2DD4BF] bg-white"
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#2DD4BF]" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>
              <label
                className="ml-3 text-sm font-medium leading-none text-gray-700 cursor-pointer select-none"
                htmlFor={`${name}-${option.value}`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </RadioGroupPrimitive.Root>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
