import React, { useState } from 'react';
import { getStoredApiKey, setStoredApiKey } from '../services/geminiService';
import { Key, ShieldCheck, Cpu, X, Check, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyChanged: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyChanged }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setSavedSuccess(true);
    onKeyChanged();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    onKeyChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg p-6 rounded-3xl liquid-glass shadow-apple-glass border border-white/10 specular-border"
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-key-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-apple-blue/20 border border-apple-blue/40 flex items-center justify-center text-apple-blue">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 id="api-key-modal-title" className="text-xl font-bold text-white tracking-tight">
              Veritas Engine Settings
            </h2>
            <p className="text-xs text-slate-400">Configure Cloud AI Reasoning or Local Heuristics</p>
          </div>
        </div>

        <div className="mb-5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <Cpu className="w-4 h-4 flex-shrink-0" />
            <span>Dual-Engine Architecture:</span>
          </div>
          <p className="text-slate-400 pl-6">
            • <strong className="text-slate-200">Local Neural Engine:</strong> Works 100% offline with zero setup required, evaluating linguistic markers, emotional loading, and sensationalism.<br />
            • <strong className="text-slate-200">Cloud Gemini 2.5 Flash:</strong> Add your Google AI Studio key to unlock multimodal reasoning, web fact-checking, and deep cognitive analysis.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="api-key-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Gemini API Key
            </label>
            <input
              id="api-key-input"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue transition-all font-mono text-sm"
            />
            <p className="mt-1.5 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Keys are stored strictly in your browser's private local storage.</span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-apple-cyan hover:underline inline-flex items-center gap-1"
              >
                Get Key <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all"
            >
              Clear Key (Use Local Mode)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-apple-blue hover:bg-apple-blue-hover shadow-apple-glow active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Saved Successfully!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
