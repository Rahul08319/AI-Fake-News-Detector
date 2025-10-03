
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800/50 py-4">
      <div className="container mx-auto px-4 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Veritas. All rights reserved.</p>
        <p className="mt-1">
          This tool uses AI and is for informational purposes only. Always verify information from multiple reputable sources.
        </p>
      </div>
    </footer>
  );
};
