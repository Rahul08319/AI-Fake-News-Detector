import React, { useState } from 'react';
import { Spinner } from './Spinner';
import { PresetClaims } from './PresetClaims';
import { 
  FileText, 
  Link as LinkIcon, 
  Sparkles, 
  Sliders, 
  Clipboard, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface AnalysisInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onUseExample: () => void;
  isLoading: boolean;
  url: string;
  onUrlChange: (value: string) => void;
  onAnalyzeUrl: () => void;
  isFetchingUrl: boolean;
  confidenceThreshold: number;
  onConfidenceChange: (value: number) => void;
  urlError?: string | null;
  textError?: string | null;
}

export const AnalysisInput: React.FC<AnalysisInputProps> = ({ 
  value, onChange, onAnalyze, onUseExample, isLoading,
  url, onUrlChange, onAnalyzeUrl, isFetchingUrl,
  confidenceThreshold, onConfidenceChange,
  urlError, textError
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'presets'>('text');
  const isBusy = isLoading || isFetchingUrl;
  const confidencePercentage = Math.round(confidenceThreshold * 100);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
      }
    } catch (e) {
      console.warn("Clipboard access denied or unsupported", e);
    }
  };

  const handleClearText = () => {
    onChange('');
  };

  const handleSelectPreset = (sampleText: string) => {
    onChange(sampleText);
    setActiveTab('text');
  };

  return (
    <div className="w-full rounded-3xl liquid-glass border border-white/10 shadow-apple-glass p-5 sm:p-8 specular-border">
      {/* Apple-style Segmented Control */}
      <div className="flex p-1.5 rounded-2xl bg-black/40 border border-white/5 mb-6 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            activeTab === 'text'
              ? 'bg-white/15 text-white shadow-apple-card'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-apple-cyan" />
          <span>Direct Text</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            activeTab === 'url'
              ? 'bg-white/15 text-white shadow-apple-card'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5 text-apple-cyan" />
          <span>Article URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            activeTab === 'presets'
              ? 'bg-white/15 text-white shadow-apple-card'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-apple-cyan" />
          <span>Preset Claims</span>
        </button>
      </div>

      {/* Tab 1: Text Input Mode */}
      {activeTab === 'text' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <label htmlFor="news-text" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Input Statement or News Excerpt
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-mono">{wordCount} words</span>
              <span>•</span>
              <span className="font-mono">{charCount} chars</span>
              {value && (
                <button
                  type="button"
                  onClick={handleClearText}
                  className="hover:text-rose-400 transition-colors p-1"
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="news-text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste headline, social media post, breaking news excerpt, or rumor to evaluate credibility..."
              rows={6}
              disabled={isBusy}
              className={`w-full p-4 rounded-2xl bg-black/40 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue transition-all duration-200 leading-relaxed text-sm resize-y disabled:opacity-50 font-normal ${
                textError ? 'border-rose-500/50' : 'border-white/10'
              }`}
            />

            {!value && (
              <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-slate-400 hover:text-white transition-all flex items-center gap-1"
                >
                  <Clipboard className="w-3 h-3 text-apple-cyan" />
                  <span>Paste</span>
                </button>
              </div>
            )}
          </div>

          {textError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{textError}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: URL Analysis Mode */}
      {activeTab === 'url' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label htmlFor="news-url" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Article or Web Page URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  id="news-url"
                  type="url"
                  value={url}
                  onChange={(e) => onUrlChange(e.target.value)}
                  placeholder="https://example.com/breaking-news-story"
                  disabled={isBusy}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue transition-all duration-200 text-sm ${
                    urlError ? 'border-rose-500/50' : 'border-white/10'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={onAnalyzeUrl}
                disabled={isBusy || !url.trim()}
                className="px-6 py-3 rounded-2xl text-xs font-semibold text-white bg-apple-blue hover:bg-apple-blue-hover shadow-apple-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 flex-shrink-0"
              >
                {isFetchingUrl ? (
                  <>
                    <Spinner size="h-4 w-4" />
                    <span>Scraping & Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Extract & Verify</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            {urlError && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{urlError}</span>
              </div>
            )}
            <p className="mt-2 text-[11px] text-slate-500">
              Veritas extracts verified paragraph text via proxy parser, screening for paywalls, bots, and script tags.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Preset Claims Library */}
      {activeTab === 'presets' && (
        <div className="animate-fade-in">
          <PresetClaims onSelectClaim={handleSelectPreset} disabled={isBusy} />
        </div>
      )}

      {/* Confidence Sensitivity Slider */}
      <div className="mt-6 pt-5 border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="confidence-threshold" className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-apple-cyan" />
            <span>Confidence Sensitivity Gate</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-apple-cyan">{confidencePercentage}%</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
              {confidencePercentage >= 75 ? 'High Rigor' : confidencePercentage >= 50 ? 'Balanced Default' : 'Permissive'}
            </span>
          </div>
        </div>

        <input
          id="confidence-threshold"
          type="range"
          min="0"
          max="100"
          value={confidencePercentage}
          onChange={(e) => onConfidenceChange(e.target.valueAsNumber / 100)}
          disabled={isBusy}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer disabled:opacity-50
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-apple-blue
            [&::-webkit-slider-thumb]:shadow-apple-glow
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-apple-blue
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-0"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>0% (Show All Findings)</span>
          <span>50% (Recommended)</span>
          <span>100% (Strict Proof Only)</span>
        </div>
      </div>

      {/* Main Execution Actions (for text mode) */}
      {activeTab === 'text' && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onUseExample}
            disabled={isBusy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-apple-amber" />
            <span>Load Classic Example</span>
          </button>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={isBusy || !value.trim()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-apple-blue to-[#005bb5] hover:brightness-110 shadow-apple-glow active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none group"
          >
            {isLoading && !isFetchingUrl ? (
              <>
                <Spinner size="h-4 w-4" />
                <span>Running Veritas Neural Scan...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-apple-cyan group-hover:scale-110 transition-transform" />
                <span>Run Credibility Inspection</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};