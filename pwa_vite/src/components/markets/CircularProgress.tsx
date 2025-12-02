interface CircularProgressProps {
  progress: number;
  strokeWidth?: number;
  strokeColor?: string;
  trackColor?: string;
}

const CircularProgress = ({
  progress = 0,
  strokeWidth = 4,
  strokeColor = "#007a55",
  trackColor = "#E5E7EB",
}: CircularProgressProps) => {
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="inline-flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad" x1="0%" x2="100%">
            <stop offset="0%" stopColor={strokeColor} />
            <stop offset="100%" stopColor={strokeColor} />
          </linearGradient>
        </defs>

        {/* TRACK */}
        <circle
          cx={50}
          cy={50}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* PROGRESS */}
        <circle
          cx={50}
          cy={50}
          r={radius}
          stroke="url(#grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 500ms ease, stroke 300ms ease" }}
        />
      </svg>
    </div>
  );
};

export default CircularProgress;
