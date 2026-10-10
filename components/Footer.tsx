import React from 'react';
import { Shield, Heart, RefreshCw, Sparkles } from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-20 border-t border-white/5 liquid-glass py-10 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-apple-blue/20 border border-apple-blue/30 flex items-center justify-center text-apple-cyan">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white font-display">
                Veritas <span className="text-apple-cyan">Pro</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              An open-source, Apple-grade computational intelligence system for real-time fake news detection, bias classification, and fact-checking provenance.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-subtle text-[11px] text-emerald-400 border border-emerald-500/20">
              <RefreshCw className="w-3 h-3 animate-[spin_8s_linear_infinite]" />
              <span>Automated Temporal Logic: Synced for {currentYear} & Beyond</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Ecosystem
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a 
                  href="https://github.com/Rahul08319/AI-Fake-News-Detector" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-apple-cyan transition-colors inline-flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href="https://aistudio.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-apple-cyan transition-colors"
                >
                  Google Gemini 2.5 Flash
                </a>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  Apple Human Interface System
                </span>
              </li>
            </ul>
          </div>

          {/* Methodology */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Fact-Check Standards
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Linguistic Emotion Scoring</li>
              <li>Source Transparency Audit</li>
              <li>Clickbait Rhetoric Detection</li>
              <li>Logical Coherence Metrics</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; 2024–{currentYear} Veritas AI Pro. Crafted with Apple design principles for truth and clarity.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">Veritas Engine v4.2.0 • {currentYear}</span>
            <span>•</span>
            <span className="text-slate-500">Informational verification tool</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
