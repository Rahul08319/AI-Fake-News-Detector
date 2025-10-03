import React from 'react';
import { type AnalysisHistoryItem, Classification } from '../types';

interface AnalysisHistoryProps {
  history: AnalysisHistoryItem[];
  onSelect: (item: AnalysisHistoryItem) => void;
  onClear: () => void;
  isLoading: boolean;
}

const classificationConfig = {
    [Classification.TRUSTWORTHY]: {
        borderColor: 'border-l-green-500',
    },
    [Classification.LIKELY_FAKE]: {
        borderColor: 'border-l-red-500',
    },
    [Classification.UNCERTAIN]: {
        borderColor: 'border-l-yellow-500',
    },
};

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ history, onSelect, onClear, isLoading }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-200">Analysis History</h2>
        <button
          onClick={onClear}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-semibold text-red-300 bg-slate-700/50 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Clear History
        </button>
      </div>
      <div className="bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-700">
        <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {history.slice().reverse().map((item) => (
            <li
              key={item.id}
              onClick={() => onSelect(item)}
              className={`p-4 bg-slate-900/50 rounded-lg cursor-pointer hover:bg-slate-900 border-l-4 transition-all duration-200 ${classificationConfig[item.classification].borderColor}`}
            >
              <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-300 truncate pr-4">
                      {item.url || `Analyzed Text: "${item.text.substring(0, 50)}..."`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.classification === Classification.TRUSTWORTHY ? 'bg-green-500/20 text-green-300' : item.classification === Classification.LIKELY_FAKE ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {item.classification}
                  </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
