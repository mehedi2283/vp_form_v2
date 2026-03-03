import * as React from "react";
import { cn } from "../../lib/utils";
import { Upload } from "lucide-react";

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <input
            type="file"
            className={cn(
              "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2DD4BF] file:text-white hover:file:bg-[#26b8a5] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              error && "border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Upload className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
FileInput.displayName = "FileInput";

export { FileInput };
