import React, { useState } from 'react';
import { type AnalysisHistoryItem, Classification } from '../types';
import { History, Trash2, Search, Star, ExternalLink, Calendar, ArrowRight } from 'lucide-react';

interface AnalysisHistoryProps {
  history: AnalysisHistoryItem[];
  onSelect: (item: AnalysisHistoryItem) => void;
  onClear: () => void;
  isLoading: boolean;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ 
  history, 
  onSelect, 
  onClear, 
  isLoading 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (history.length === 0) {
    return null;
  }

  const filteredHistory = history.filter(item => {
    const textMatch = item.text.toLowerCase().includes(searchQuery.toLowerCase());
    const urlMatch = item.url ? item.url.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const classMatch = item.classification.toLowerCase().includes(searchQuery.toLowerCase());
    return textMatch || urlMatch || classMatch;
  });

  return (
    <div className="mt-12 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-apple-cyan">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Inspection History
            </h2>
            <p className="text-xs text-slate-400">Locally archived fact-checks and telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick search filter */}
          {history.length > 3 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter history..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-apple-blue"
              />
            </div>
          )}

          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      <div className="rounded-3xl liquid-glass border border-white/10 p-3 sm:p-4 shadow-apple-glass specular-border">
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredHistory.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-500">
              No matching records found for "{searchQuery}".
            </p>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="group p-4 rounded-2xl liquid-glass-subtle hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 active:scale-[0.99]"
              >
                <div className="space-y-1 min-w-0 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.classification === Classification.TRUSTWORTHY
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                        : item.classification === Classification.LIKELY_FAKE
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                    }`}>
                      {item.classification}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {Math.round(item.confidenceScore * 100)}% Confidence
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white transition-colors truncate">
                    {item.url ? `URL: ${item.url}` : item.text.substring(0, 120)}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                    {item.mode && (
                      <>
                        <span>•</span>
                        <span>{item.mode === 'gemini-ai' ? 'Gemini 2.5 Flash' : 'Local Engine'}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-apple-cyan transition-colors self-end sm:self-center flex-shrink-0">
                  <span className="hidden sm:inline font-medium">Re-inspect</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
