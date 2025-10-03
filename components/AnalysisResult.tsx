import React, { useState, useEffect } from 'react';
import { type AnalysisResultData, Classification } from '../types';

interface AnalysisResultProps {
  result: AnalysisResultData;
  analyzedUrl?: string | null;
  analysisId: string | null;
}

const classificationConfig = {
  [Classification.TRUSTWORTHY]: {
    label: 'Trustworthy',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    textColor: 'text-green-300',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    progressColor: 'text-green-400'
  },
  [Classification.LIKELY_FAKE]: {
    label: 'Likely Fake',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    textColor: 'text-red-300',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    progressColor: 'text-red-400'
  },
  [Classification.UNCERTAIN]: {
    label: 'Uncertain',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    textColor: 'text-yellow-300',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    progressColor: 'text-yellow-400'
  },
};

const ConfidenceGauge: React.FC<{ score: number, color: string }> = ({ score, color }) => {
    const percentage = Math.round(score * 100);
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-slate-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
                <circle
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-100">{percentage}%</span>
            </div>
        </div>
    );
}

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const CopiedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const FEEDBACK_PREFIX = 'veritas_feedback_';

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, analyzedUrl, analysisId }) => {
  const config = classificationConfig[result.classification];
  const [isCopied, setIsCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(() => {
    if (!analysisId) return false;
    return !!localStorage.getItem(`${FEEDBACK_PREFIX}${analysisId}`);
  });

  useEffect(() => {
    if (!analysisId) {
      setFeedbackGiven(false);
      return;
    }
    const hasFeedback = !!localStorage.getItem(`${FEEDBACK_PREFIX}${analysisId}`);
    setFeedbackGiven(hasFeedback);
  }, [analysisId]);


  const handleShare = async () => {
    const percentage = Math.round(result.confidenceScore * 100);
    let shareText = `Veritas AI Analysis:\n- Result: ${result.classification}\n- Confidence: ${percentage}%\n\nAnalyzed with Veritas AI.`;

    if (analyzedUrl) {
      shareText = `Veritas AI Analysis for ${analyzedUrl}:\n- Result: ${result.classification}\n- Confidence: ${percentage}%`;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Veritas AI: Fake News Analysis',
          text: shareText,
          url: analyzedUrl || undefined,
        });
      } catch (error) {
        console.error('Error using Web Share API:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        alert('Failed to copy analysis to clipboard.');
      }
    }
  };
  
  const handleFeedback = (feedback: 'yes' | 'no') => {
    if (!analysisId) return;
    try {
      localStorage.setItem(`${FEEDBACK_PREFIX}${analysisId}`, feedback);
      setFeedbackGiven(true);
      console.log(`Feedback submitted for analysis ${analysisId}: ${feedback}. This would be sent to an analytics endpoint.`);
    } catch (e) {
      console.error("Failed to save feedback to localStorage", e);
    }
  };

  return (
    <div className={`relative border ${config.borderColor} ${config.bgColor} rounded-xl shadow-2xl p-4 sm:p-6 animate-fade-in`}>
      <button
        onClick={handleShare}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-slate-700/50 hover:bg-slate-700 transition-colors text-slate-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-label="Share analysis"
        title={isCopied ? "Copied!" : "Share analysis"}
      >
        {isCopied ? <CopiedIcon /> : <ShareIcon />}
      </button>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="flex-shrink-0">
            <ConfidenceGauge score={result.confidenceScore} color={config.progressColor} />
            <p className="text-center mt-2 text-sm text-slate-400">Confidence</p>
        </div>
        <div className="flex-grow text-center md:text-left">
            <div className={`inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full ${config.bgColor} border ${config.borderColor}`}>
              <div className="w-6 h-6 sm:w-8 sm:h-8">{config.icon}</div>
              <h2 className={`text-2xl sm:text-3xl font-bold ${config.textColor}`}>{config.label}</h2>
            </div>
            <div className="mt-4">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-200">Explanation</h3>
              <p className="text-slate-300 mt-1 text-sm sm:text-base">{result.explanation}</p>
            </div>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-700/50 pt-6">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">Key Points & Red Flags</h3>
        <ul className="space-y-3">
          {result.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className={`mr-3 mt-1 flex-shrink-0 w-4 h-4 rounded-full ${config.progressColor} opacity-50`}></span>
              <span className="text-slate-300 text-sm sm:text-base">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-slate-700/50 pt-5">
        {feedbackGiven ? (
          <p className="text-center text-green-400 font-semibold italic">
            Thank you for your feedback!
          </p>
        ) : (
          <div className="text-center">
            <p className="text-slate-400 mb-3">Was this analysis helpful?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleFeedback('yes')}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Mark analysis as helpful"
              >
                👍 Yes
              </button>
              <button
                onClick={() => handleFeedback('no')}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Mark analysis as not helpful"
              >
                👎 No
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};