import React from 'react';
import { Cpu, Search, AlertCircle, ShieldCheck } from 'lucide-react';

interface ScanningAnimationProps {
  progress: number;
  message: string;
}

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ progress, message }) => {
  const roundedProgress = Math.round(progress);

  const stages = [
    { threshold: 0, label: 'Syntactic & Token Extraction', icon: Cpu },
    { threshold: 30, label: 'Cross-Referencing Fact Registries', icon: Search },
    { threshold: 65, label: 'Auditing Emotional Manipulation & Tone', icon: AlertCircle },
    { threshold: 85, label: 'Calibrating Multi-Dimensional Credibility', icon: ShieldCheck },
  ];

  return (
    <div className="w-full max-w-lg mx-auto py-8 px-6 rounded-3xl liquid-glass border border-white/10 shadow-apple-glass text-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-apple-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-apple-cyan/15 rounded-full blur-3xl pointer-events-none" />

      {/* Radar scanner visual */}
      <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-apple-blue/20 animate-ping opacity-25" />
        <div className="absolute inset-2 rounded-full border border-white/10" />
        <div className="absolute inset-6 rounded-full border border-apple-cyan/25" />
        <div className="absolute inset-10 rounded-full border border-dashed border-white/15 animate-[spin_12s_linear_infinite]" />

        {/* Rotating Radar Sweep Beam */}
        <div 
          className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 113, 227, 0.4) 360deg)'
          }}
        />

        {/* Central Core */}
        <div className="relative z-10 w-16 h-16 rounded-2xl liquid-glass border border-white/20 shadow-apple-glow flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono tracking-tight text-white">
            {roundedProgress}%
          </span>
        </div>
      </div>

      {/* Primary Message */}
      <h3 className="text-lg font-bold text-white tracking-tight mb-2">
        {message}
      </h3>
      <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
        Veritas Neural Pipeline is performing multi-vector credibility inspection across semantic, stylistic, and factual dimensions.
      </p>

      {/* Apple-style Progress Track */}
      <div className="w-full bg-white/5 rounded-full h-2 p-0.5 border border-white/10 mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-apple-blue via-apple-cyan to-emerald-400 transition-all duration-300 ease-out shadow-apple-glow"
          style={{ width: `${roundedProgress}%` }}
        />
      </div>

      {/* Stage Checklist */}
      <div className="grid grid-cols-2 gap-2 text-left">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isPassed = roundedProgress >= stage.threshold + 20;
          const isCurrent = roundedProgress >= stage.threshold && !isPassed;

          return (
            <div 
              key={idx}
              className={`p-2 rounded-xl text-[11px] transition-all flex items-center gap-2 ${
                isPassed 
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                  : isCurrent 
                  ? 'bg-apple-blue/15 text-apple-cyan border border-apple-blue/30 shadow-apple-glow' 
                  : 'bg-white/[0.02] text-slate-500 border border-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isCurrent ? 'animate-pulse' : ''}`} />
              <span className="truncate">{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
