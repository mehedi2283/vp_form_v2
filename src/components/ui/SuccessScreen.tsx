import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "./Button";

interface SuccessScreenProps {
  applicationId: string;
}

export const SuccessScreen = ({ applicationId }: SuccessScreenProps) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      window.location.reload();
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6 transition-all duration-500 transform translate-y-0 opacity-100"
      >
        <div
          className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">
            Application Submitted Successfully!
          </h2>
          <div className="inline-block bg-[#2DD4BF]/10 text-[#2DD4BF] px-4 py-2 rounded-full font-mono font-bold text-sm">
            Application ID: {applicationId}
          </div>
        </div>

        <div className="space-y-4 text-gray-600">
          <p>
            Our admissions team will be in touch with you shortly.
          </p>
          <p className="text-sm text-gray-400">
            Redirecting to start in {countdown} seconds...
          </p>
        </div>

        <Button onClick={() => window.location.reload()} className="w-full">
          Start New Application Now
        </Button>
      </div>
    </div>
  );
};
