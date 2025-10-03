import React from 'react';

interface ProgressBarProps {
  progress: number;
  message: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, message }) => {
  const roundedProgress = Math.round(progress);

  return (
    <div className="w-full max-w-md px-4">
      <p className="text-center text-slate-300 font-semibold mb-3">
        {message}
      </p>
      <div className="w-full bg-slate-700 rounded-full h-2.5 shadow-inner">
        <div
          className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${roundedProgress}%` }}
        ></div>
      </div>
      <p className="text-center text-sm text-slate-400 mt-2 tabular-nums">
        {roundedProgress}%
      </p>
    </div>
  );
};