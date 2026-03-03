import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay = ({ message }: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div
        className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.15)] max-w-sm w-full flex flex-col items-center space-y-6 border border-gray-100"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#2DD4BF]/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#2DD4BF] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-gray-900 text-center animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};
