import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { type AnalysisResultData, Classification } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Share2, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink,
  Shield, 
  Cpu, 
  BarChart3, 
  Compass, 
  ArrowUpRight,
  ListChecks,
  Sparkles
} from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResultData;
  analyzedUrl?: string | null;
  analysisId: string | null;
}

const classificationConfig = {
  [Classification.TRUSTWORTHY]: {
    label: 'Verified Trustworthy',
    badgeText: 'Low Misinformation Risk',
    icon: CheckCircle2,
    accentColor: 'text-emerald-400',
    glowColor: 'rgba(48, 209, 88, 0.25)',
    cardBorder: 'border-emerald-500/30',
    cardBg: 'bg-emerald-500/10',
    strokeColor: '#30d158',
    gradient: 'from-emerald-500/20 via-transparent to-transparent',
  },
  [Classification.LIKELY_FAKE]: {
    label: 'Likely Fabricated / Misleading',
    badgeText: 'High Deception Risk',
    icon: AlertTriangle,
    accentColor: 'text-rose-400',
    glowColor: 'rgba(255, 69, 58, 0.25)',
    cardBorder: 'border-rose-500/30',
    cardBg: 'bg-rose-500/10',
    strokeColor: '#ff453a',
    gradient: 'from-rose-500/20 via-transparent to-transparent',
  },
  [Classification.UNCERTAIN]: {
    label: 'Uncertain / Mixed Credibility',
    badgeText: 'Requires Cross-Verification',
    icon: HelpCircle,
    accentColor: 'text-amber-400',
    glowColor: 'rgba(255, 159, 10, 0.25)',
    cardBorder: 'border-amber-500/30',
    cardBg: 'bg-amber-500/10',
    strokeColor: '#ff9f0a',
    gradient: 'from-amber-500/20 via-transparent to-transparent',
  },
};

const RadialConfidenceGauge: React.FC<{ score: number; strokeColor: string }> = ({ score, strokeColor }) => {
  const percentage = Math.round(score * 100);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        {/* Background track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="9"
          fill="transparent"
        />
        {/* Animated Progress arc */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={strokeColor}
          strokeWidth="9"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${strokeColor}66)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
          {percentage}%
        </span>
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
          Confidence
        </span>
      </div>
    </div>
  );
};

const FEEDBACK_PREFIX = 'veritas_feedback_';

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, analyzedUrl, analysisId }) => {
  const config = classificationConfig[result.classification];
  const [isCopied, setIsCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(() => {
    if (!analysisId) return false;
    return !!localStorage.getItem(`${FEEDBACK_PREFIX}${analysisId}`);
  });

  // Trigger celebration confetti if trustworthy
  useEffect(() => {
    if (result.classification === Classification.TRUSTWORTHY && result.confidenceScore >= 0.75) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#30d158', '#0071e3', '#64d2ff']
        });
      } catch (e) {
        // Confetti optional
      }
    }
  }, [result]);

  useEffect(() => {
    if (!analysisId) {
      setFeedbackGiven(false);
      return;
    }
    setFeedbackGiven(!!localStorage.getItem(`${FEEDBACK_PREFIX}${analysisId}`));
  }, [analysisId]);

  const handleShare = async () => {
    const percentage = Math.round(result.confidenceScore * 100);
    const summary = `🛡️ Veritas AI Credibility Report\n- Classification: ${result.classification}\n- Confidence: ${percentage}%\n- Summary: ${result.verdictSummary || result.explanation.slice(0, 100)}\n\nAnalyzed with Veritas Pro.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Veritas AI Fact-Check Report',
          text: summary,
          url: analyzedUrl || window.location.href,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(summary);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2200);
      } catch (error) {
        alert('Could not copy report to clipboard.');
      }
    }
  };

  const handleFeedback = (feedback: 'yes' | 'no') => {
    if (!analysisId) return;
    try {
      localStorage.setItem(`${FEEDBACK_PREFIX}${analysisId}`, feedback);
      setFeedbackGiven(true);
    } catch (e) {
      console.warn("Feedback save failed", e);
    }
  };

  const IconComponent = config.icon;

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* ===================== APPLE BENTO GRID ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Bento Card 1: Primary Verdict & Radial Gauge (Span 2) */}
        <div className={`md:col-span-2 rounded-3xl liquid-glass border ${config.cardBorder} p-6 sm:p-8 relative overflow-hidden shadow-apple-glass specular-border`}>
          <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${config.gradient} pointer-events-none`} />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="flex-shrink-0">
              <RadialConfidenceGauge 
                score={result.confidenceScore} 
                strokeColor={config.strokeColor} 
              />
            </div>

            <div className="flex-grow text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                <IconComponent className={`w-4 h-4 ${config.accentColor}`} />
                <span className="font-semibold">{config.badgeText}</span>
              </div>

              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${config.accentColor} font-display`}>
                {config.label}
              </h2>

              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {result.verdictSummary || result.explanation}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                  Engine: {result.mode === 'gemini-ai' ? 'Cloud Gemini 2.5 Flash' : 'Veritas Local Neural Core'}
                </span>
                {result.analyzedYear && (
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                    Year Benchmark: {result.analyzedYear}
                  </span>
                )}
                {analyzedUrl && (
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 truncate max-w-xs">
                    Source: {new URL(analyzedUrl).hostname}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bento Card 2: Sentiment & Emotional Rhetoric Profile (Span 1) */}
        <div className="rounded-3xl liquid-glass border border-white/10 p-6 flex flex-col justify-between shadow-apple-glass specular-border">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-apple-purple" />
                <span>Rhetorical Tone</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-apple-purple/15 text-apple-purple border border-apple-purple/20 font-bold">
                {result.sentiment?.label || 'Analyzed'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {result.sentiment?.label || 'Balanced'} Tone
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assesses whether the narrative employs alarmist phrasing, emotional coercion, or objective factual neutrality.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Intensity Index</span>
              <span className="font-mono text-white font-semibold">
                {result.sentiment?.intensity || 35}%
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-apple-indigo to-apple-purple transition-all duration-700 ease-out"
                style={{ width: `${result.sentiment?.intensity || 35}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bento Card 3: 5-Dimensional Granular Credibility Metrics (Span 2) */}
        {result.metrics && (
          <div className="md:col-span-2 rounded-3xl liquid-glass border border-white/10 p-6 sm:p-7 shadow-apple-glass specular-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-apple-cyan" />
                <span>Credibility Breakdown Telemetry</span>
              </h3>
              <span className="text-[11px] text-slate-500">Multivariate Index (0-100)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sensationalism */}
              <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/5">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Sensationalism & Clickbait</span>
                  <span className={`font-mono font-bold ${result.metrics.sensationalism > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {result.metrics.sensationalism}%
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${result.metrics.sensationalism > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${result.metrics.sensationalism}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Lower is better</span>
              </div>

              {/* Source Transparency */}
              <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/5">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Source Transparency & Citations</span>
                  <span className={`font-mono font-bold ${result.metrics.sourceTransparency >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {result.metrics.sourceTransparency}%
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${result.metrics.sourceTransparency}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Higher is better</span>
              </div>

              {/* Emotional Bias */}
              <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/5">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Emotional Polarization</span>
                  <span className={`font-mono font-bold ${result.metrics.emotionalBias > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {result.metrics.emotionalBias}%
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${result.metrics.emotionalBias > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${result.metrics.emotionalBias}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Lower is better</span>
              </div>

              {/* Logical Coherence */}
              <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/5">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Logical Coherence & Syllogism</span>
                  <span className={`font-mono font-bold ${result.metrics.logicalCoherence >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.metrics.logicalCoherence}%
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-apple-blue transition-all duration-700"
                    style={{ width: `${result.metrics.logicalCoherence}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Higher is better</span>
              </div>
            </div>
          </div>
        )}

        {/* Bento Card 4: Action Checklist (Span 1) */}
        <div className="rounded-3xl liquid-glass border border-white/10 p-6 flex flex-col justify-between shadow-apple-glass specular-border">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              <ListChecks className="w-4 h-4 text-apple-emerald" />
              <span>Recommended Actions</span>
            </div>
            <ul className="space-y-2.5">
              {(result.suggestedActions || [
                'Consult primary news wire services (Reuters, AP).',
                'Verify author credentials and publishing platform history.',
                'Cross-check reverse image searches for viral screenshots.'
              ]).map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-cyan mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Verified against facts database</span>
            <Sparkles className="w-3.5 h-3.5 text-apple-cyan" />
          </div>
        </div>

        {/* Bento Card 5: Key Points & Red Flags (Full Span 3) */}
        <div className="md:col-span-3 rounded-3xl liquid-glass border border-white/10 p-6 sm:p-8 shadow-apple-glass specular-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-apple-cyan" />
              <span>Key Points & Forensic Evidence Markers</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {result.keyPoints.length} Findings Cataloged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.keyPoints.map((point, index) => (
              <div 
                key={index} 
                className="p-4 rounded-2xl liquid-glass-subtle border border-white/5 flex items-start gap-3 hover:bg-white/[0.05] transition-colors"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
                  result.classification === Classification.TRUSTWORTHY
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : result.classification === Classification.LIKELY_FAKE
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {index + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Deep Explanation Block */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Executive Reasoning & Context
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/25 p-4 rounded-2xl border border-white/5">
              {result.explanation}
            </p>
          </div>
        </div>

      </div>

      {/* Export, Share & Reader Feedback Strip */}
      <div className="p-4 sm:p-5 rounded-2xl liquid-glass border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-apple-card">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-semibold shadow-apple-glow active:scale-95 transition-all flex items-center gap-2"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Fact-Check</span>
              </>
            )}
          </button>
        </div>

        {/* Feedback Widget */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {feedbackGiven ? (
            <span className="text-emerald-400 font-medium inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you for validating this verification!</span>
            </span>
          ) : (
            <>
              <span>Was this assessment accurate?</span>
              <button
                type="button"
                onClick={() => handleFeedback('yes')}
                className="p-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                title="Mark as accurate"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Yes</span>
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('no')}
                className="p-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                title="Mark as inaccurate"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                <span>No</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};