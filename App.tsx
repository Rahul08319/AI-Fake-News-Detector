import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AnalysisInput } from './components/AnalysisInput';
import { AnalysisResult } from './components/AnalysisResult';
import { ScanningAnimation } from './components/ScanningAnimation';
import { AnalysisHistory } from './components/AnalysisHistory';
import { ApiKeyModal } from './components/ApiKeyModal';
import { analyzeText, hasApiKey } from './services/geminiService';
import { type AnalysisResultData, type AnalysisHistoryItem } from './types';
import { ShieldCheck, Sparkles, Zap, Globe, AlertCircle } from 'lucide-react';

const CLASSIC_EXAMPLE_TEXT = `Scientists have discovered a new species of glowing mushrooms in the Amazon rainforest that can power small electronic devices. The mushrooms, named "Lumina electra," produce a steady bio-luminescent electrical current. A research paper published in "Nature Innovations" claims that a small cluster of these mushrooms can charge a smartphone in under an hour. Tech companies are reportedly scrambling to secure rights to cultivate these fungi for a new generation of organic batteries.`;

const MAX_HTML_SIZE_BYTES = 1 * 1024 * 1024; // 1MB
const FETCH_TIMEOUT_MS = 15000;
const CORS_PROXY = 'https://thingproxy.freeboard.io/fetch/';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [url, setUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultData | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState<string | null>(null);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [textError, setTextError] = useState<string | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(hasApiKey());
  const progressIntervalRef = useRef<number | null>(null);

  const [history, setHistory] = useState<AnalysisHistoryItem[]>(() => {
    try {
      const savedHistory = localStorage.getItem('analysisHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('analysisHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const saveAnalysisResult = (result: AnalysisResultData, text: string, sourceUrl?: string) => {
    setAnalysisResult(result);
    const newHistoryItem: AnalysisHistoryItem = {
      ...result,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: text,
      timestamp: new Date().toISOString(),
      url: sourceUrl
    };
    setCurrentAnalysisId(newHistoryItem.id);
    setHistory(prevHistory => [newHistoryItem, ...prevHistory.slice(0, 19)]);
  };

  const startProgressSimulation = (startingPoint: number) => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(startingPoint);
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 94) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          return 94;
        }
        return Math.min(prev + Math.random() * 6, 94);
      });
    }, 320);
  };
  
  const finishProgress = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setIsFetchingUrl(false);
      setProgress(0);
    }, 450);
  };

  const runDirectAnalysis = async () => {
    if (!inputText.trim()) {
      setTextError('Please enter or paste a statement to analyze.');
      return;
    }
    
    setIsLoading(true);
    setIsFetchingUrl(false);
    setError(null);
    setUrlError(null);
    setTextError(null);
    setAnalysisResult(null);
    setAnalyzedUrl(null);

    startProgressSimulation(15);
    
    try {
      const result = await analyzeText(inputText);
      saveAnalysisResult(result, inputText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during analysis.');
    } finally {
      finishProgress();
    }
  };

  const runUrlAnalysis = async () => {
    if (!url.trim()) {
      setUrlError('Please enter a web article URL to inspect.');
      return;
    }
    
    try {
      const validUrl = new URL(url);
      if (validUrl.protocol !== 'http:' && validUrl.protocol !== 'https:') {
        throw new Error("URL must begin with http:// or https://");
      }
    } catch (e) {
      let errorMessage = "The URL format is invalid. Please provide a full URL with https://.";
      if (e instanceof Error && e.message.includes('http')) {
        errorMessage = e.message;
      }
      setUrlError(errorMessage);
      return;
    }

    setIsLoading(true);
    setIsFetchingUrl(true);
    setError(null);
    setUrlError(null);
    setTextError(null);
    setAnalysisResult(null);
    setInputText('');
    setAnalyzedUrl(url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      setProgress(15);
      const response = await fetch(`${CORS_PROXY}${url}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch article. Server responded with status: ${response.status}`);
      }
      
      setProgress(45);
      const htmlText = await response.text();

      if (new Blob([htmlText]).size > MAX_HTML_SIZE_BYTES) {
        throw new Error(`Page content exceeds processing limit (${MAX_HTML_SIZE_BYTES / 1024 / 1024}MB).`);
      }
      
      setProgress(65);
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const paragraphs = Array.from(doc.querySelectorAll('article p, main p, p'));
      const extractedText = paragraphs
        .map(p => p.textContent?.trim() || '')
        .filter(t => t.length > 30)
        .join('\n\n')
        .trim();

      if (!extractedText || extractedText.length < 150) {
        throw new Error('Could not extract sufficient article text from this URL. The content may be protected by a paywall or rendered dynamically via client-side scripts.');
      }
      
      setInputText(extractedText);
      setIsFetchingUrl(false);
      startProgressSimulation(70);
      
      const result = await analyzeText(extractedText);
      saveAnalysisResult(result, extractedText, url);

    } catch (err) {
      clearTimeout(timeoutId);
      let errorMessage = 'An error occurred while fetching the URL.';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'The URL request timed out. The website may be protected or slow to respond.';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      finishProgress();
    }
  };
  
  const handleUseExample = () => {
    setInputText(CLASSIC_EXAMPLE_TEXT);
    setUrl('');
    setAnalysisResult(null);
    setError(null);
    setTextError(null);
    setUrlError(null);
    setCurrentAnalysisId(null);
  };

  const handleSelectHistory = (item: AnalysisHistoryItem) => {
    setInputText(item.text);
    setUrl(item.url || '');
    setAnalysisResult({
      classification: item.classification,
      confidenceScore: item.confidenceScore,
      explanation: item.explanation,
      keyPoints: item.keyPoints,
      metrics: item.metrics,
      sentiment: item.sentiment,
      verdictSummary: item.verdictSummary,
      suggestedActions: item.suggestedActions,
      analyzedYear: item.analyzedYear,
      mode: item.mode
    });
    setAnalyzedUrl(item.url || null);
    setCurrentAnalysisId(item.id);
    setError(null);
    setTextError(null);
    setUrlError(null);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleInputTextChange = (value: string) => {
    setInputText(value);
    if (textError) setTextError(null);
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (urlError) setUrlError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070a11] text-slate-100 font-sans selection:bg-apple-blue selection:text-white">
      {/* Background ambient light orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-apple-blue/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[500px] h-[500px] bg-apple-indigo/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Header */}
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        apiKeySet={apiKeySet}
      />

      {/* Settings Modal */}
      <ApiKeyModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onKeyChanged={() => setApiKeySet(hasApiKey())}
      />

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Apple Hero Header */}
          <div className="text-center space-y-4 pt-4 sm:pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-white/10 text-xs text-slate-300 shadow-apple-card">
              <Sparkles className="w-3.5 h-3.5 text-apple-cyan" />
              <span className="font-medium">Apple-Grade Intelligence & Neural Verification</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
              Truth at the speed of <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-apple-cyan via-apple-blue to-apple-purple bg-clip-text text-transparent">
                computational clarity.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Veritas Pro employs deep semantic analysis, rhetorical sentiment auditing, and multi-vector cross-corroboration to reveal disinformation before it spreads.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Multi-Vector Forensic Audit
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-apple-amber" />
                Sub-Second Neural Scanning
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-apple-cyan" />
                Zero Data Tracking
              </span>
            </div>
          </div>

          {/* Main Analysis Input Surface */}
          <AnalysisInput
            value={inputText}
            onChange={handleInputTextChange}
            onAnalyze={runDirectAnalysis}
            onUseExample={handleUseExample}
            isLoading={isLoading && !isFetchingUrl}
            url={url}
            onUrlChange={handleUrlChange}
            onAnalyzeUrl={runUrlAnalysis}
            isFetchingUrl={isFetchingUrl}
            confidenceThreshold={confidenceThreshold}
            onConfidenceChange={setConfidenceThreshold}
            urlError={urlError}
            textError={textError}
          />

          {/* Results / Progress / Error Display Area */}
          <div className="space-y-6">
            {isLoading && (
              <ScanningAnimation 
                progress={progress}
                message={isFetchingUrl ? 'Scraping & Normalizing Article Text...' : 'Evaluating Statement Credibility...'}
              />
            )}

            {error && (
              <div className="p-4 sm:p-5 rounded-2xl liquid-glass border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 shadow-apple-card animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-semibold text-rose-200">Analysis Encountered an Issue:</strong>
                  <p className="text-rose-300/90">{error}</p>
                </div>
              </div>
            )}

            {analysisResult && !isLoading && (
              analysisResult.confidenceScore >= confidenceThreshold ? (
                <AnalysisResult 
                  result={analysisResult} 
                  analyzedUrl={analyzedUrl}
                  analysisId={currentAnalysisId} 
                />
              ) : (
                <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-amber-500/30 text-center shadow-apple-glass space-y-3 animate-fade-in">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-300 font-display">
                    Analysis Gated Below Confidence Threshold
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    The analysis completed with a confidence rating of{' '}
                    <strong className="text-white font-mono">{Math.round(analysisResult.confidenceScore * 100)}%</strong>, 
                    which is beneath your active rigor threshold of{' '}
                    <strong className="text-white font-mono">{Math.round(confidenceThreshold * 100)}%</strong>.
                  </p>
                  <p className="text-xs text-slate-500">
                    Slide the Confidence Sensitivity Gate downward to view the full report.
                  </p>
                </div>
              )
            )}
          </div>

          {/* History */}
          <AnalysisHistory
            history={history}
            onSelect={handleSelectHistory}
            onClear={handleClearHistory}
            isLoading={isLoading || isFetchingUrl}
          />

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;