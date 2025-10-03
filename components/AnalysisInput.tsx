import React from 'react';
import { Spinner } from './Spinner';

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
  const isBusy = isLoading || isFetchingUrl;
  const confidencePercentage = Math.round(confidenceThreshold * 100);

  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-2xl border border-slate-700">
      <div>
        <label htmlFor="news-url" className="block text-lg font-medium text-slate-300 mb-2">
          Analyze from URL
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="news-url"
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com/news-article"
            className={`flex-grow p-3 bg-slate-900 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 text-slate-200 placeholder-slate-500 disabled:opacity-50 ${urlError ? 'border-red-500/50' : 'border-slate-600'}`}
            disabled={isBusy}
            aria-label="URL of the article to analyze"
            aria-invalid={!!urlError}
            aria-describedby="url-error"
          />
          <button
            onClick={onAnalyzeUrl}
            disabled={isBusy || !url.trim()}
            className="w-full sm:w-auto px-5 py-3 text-base font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/30"
          >
            {isFetchingUrl ? <><Spinner size="h-5 w-5" /> Fetching...</> : 'Fetch & Analyze'}
          </button>
        </div>
        {urlError && <p id="url-error" className="text-red-400 text-sm mt-2">{urlError}</p>}
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-800 px-3 text-sm font-medium text-slate-400">OR</span>
        </div>
      </div>

      <label htmlFor="news-text" className="block text-lg font-medium text-slate-300 mb-2">
        Paste Text Directly
      </label>
      <textarea
        id="news-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste a news article, social media post, or any text here..."
        className={`w-full h-48 p-4 bg-slate-900 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-y text-slate-200 placeholder-slate-500 disabled:opacity-50 ${textError ? 'border-red-500/50' : 'border-slate-600'}`}
        disabled={isBusy}
        aria-label="Text to analyze"
        aria-invalid={!!textError}
        aria-describedby="text-error"
      />
      {textError && <p id="text-error" className="text-red-400 text-sm mt-2">{textError}</p>}

      <div className="mt-6">
        <label htmlFor="confidence-threshold" className="block text-sm font-medium text-slate-400 mb-2">
          Minimum Confidence Threshold: <span className="font-bold text-cyan-400">{confidencePercentage}%</span>
        </label>
        <input
          id="confidence-threshold"
          type="range"
          min="0"
          max="100"
          value={confidencePercentage}
          onChange={(e) => onConfidenceChange(e.target.valueAsNumber / 100)}
          disabled={isBusy}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-cyan-500
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:bg-cyan-500
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0"
          aria-label="Minimum confidence threshold slider"
        />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onUseExample}
          disabled={isBusy}
          className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-cyan-300 bg-slate-700/50 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Use Example
        </button>
        <button
          onClick={onAnalyze}
          disabled={isBusy || !value.trim()}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 text-lg font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/30"
        >
          {isLoading && !isFetchingUrl ? 'Analyzing...' : 'Analyze Text'}
        </button>
      </div>
    </div>
  );
};