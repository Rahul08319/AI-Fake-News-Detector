import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800/50 py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-cyan-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Veritas AI
          </h1>
        </div>
        <p className="text-sm text-slate-400 hidden sm:block">Your AI-Powered Fact-Checker</p>
      </div>
    </header>
  );
};