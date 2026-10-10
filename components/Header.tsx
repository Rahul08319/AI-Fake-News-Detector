import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Settings, Activity, Clock } from 'lucide-react';
import { hasApiKey } from '../services/geminiService';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface HeaderProps {
  onOpenSettings: () => void;
  apiKeySet: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, apiKeySet }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full liquid-glass border-b border-white/10 backdrop-blur-2xl">
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-apple-blue via-apple-indigo to-apple-purple flex items-center justify-center shadow-apple-glow p-0.5 transition-transform duration-300 group-hover:scale-105 active:scale-95">
              <div className="w-full h-full rounded-[14px] bg-[#070a11] flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-apple-cyan" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#070a11] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
                Veritas <span className="text-apple-cyan">Pro</span>
              </h1>
              <span className="hidden xs:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-apple-blue/20 text-apple-cyan border border-apple-blue/30">
                AI Fact-Check
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Apple-Grade Misinformation & Fake News Intelligence
            </p>
          </div>
        </div>

        {/* Live Operational Status Telemetry */}
        <div className="hidden lg:flex items-center gap-4 py-1.5 px-3.5 rounded-full liquid-glass-subtle border border-white/5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-[11px] text-emerald-400">Engine Operational</span>
          </div>
          
          <span className="text-slate-600">•</span>
          
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{currentTime || 'Syncing...'}</span>
          </div>

          <span className="text-slate-600">•</span>

          <span className="text-[11px] text-slate-400 font-mono">
            Calendar {currentYear}
          </span>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Indicator Pill */}
          <div 
            onClick={onOpenSettings}
            className="cursor-pointer hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] border border-white/10 text-xs transition-colors"
            title="Click to manage AI Engine API Key"
          >
            <Activity className="w-3.5 h-3.5 text-apple-cyan" />
            <span className="text-[11px] text-slate-300">
              {apiKeySet ? 'Cloud Gemini 2.5' : 'Local Neural Engine'}
            </span>
          </div>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:px-3 sm:py-2 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs"
            aria-label="Engine Settings"
            title="Configure API Key"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* GitHub Repo Button */}
          <a
            href="https://github.com/Rahul08319/AI-Fake-News-Detector"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white transition-all duration-200 active:scale-95 flex items-center gap-2 text-xs font-medium shadow-apple-card"
            title="Star Veritas on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};