
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  className?: string;
}

const LoadingIndicator = ({ className }: LoadingIndicatorProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative h-16 w-16">
        <div className="absolute h-full w-full rounded-full border-4 border-t-sky-500 border-r-sky-300 border-b-sky-200 border-l-sky-400 animate-spin"></div>
        <div className="absolute h-12 w-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-t-sky-400 border-r-sky-200 border-b-sky-300 border-l-sky-500 animate-spin animation-delay-200"></div>
        <div className="absolute h-8 w-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-t-sky-300 border-r-sky-400 border-b-sky-500 border-l-sky-200 animate-spin animation-delay-500"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
