import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AnalysisInput } from './components/AnalysisInput';
import { AnalysisResult } from './components/AnalysisResult';
import { ProgressBar } from './components/ProgressBar';
import { AnalysisHistory } from './components/AnalysisHistory';
import { analyzeText } from './services/geminiService';
import { type AnalysisResultData, type AnalysisHistoryItem } from './types';

const EXAMPLE_TEXT = `Scientists have discovered a new species of glowing mushrooms in the Amazon rainforest that can power small electronic devices. The mushrooms, named "Lumina electra," produce a steady bio-luminescent electrical current. A research paper published in "Nature Innovations" claims that a small cluster of these mushrooms can charge a smartphone in under an hour. Tech companies are reportedly scrambling to secure rights to cultivate these fungi for a new generation of organic batteries.`;

const MAX_HTML_SIZE_BYTES = 1 * 1024 * 1024; // 1MB
const FETCH_TIMEOUT_MS = 15000; // 15 seconds
const CORS_PROXY = 'https://thingproxy.freeboard.io/fetch/'; // A simple CORS proxy

const App: React.FC = () => {
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
      id: new Date().toISOString() + Math.random(),
      text: text,
      timestamp: new Date().toISOString(),
      url: sourceUrl
    };
    setCurrentAnalysisId(newHistoryItem.id);
    setHistory(prevHistory => [newHistoryItem, ...prevHistory.slice(0, 9)]);
  };

  const startProgressSimulation = (startingPoint: number) => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(startingPoint);
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          return 95;
        }
        return Math.min(prev + Math.random() * 5, 95);
      });
    }, 400);
  };
  
  const finishProgress = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setIsFetchingUrl(false);
      setProgress(0);
    }, 500);
  };

  const runDirectAnalysis = async () => {
    if (!inputText.trim()) {
      setTextError('Please paste some text to analyze.');
      return;
    }
    
    setIsLoading(true);
    setIsFetchingUrl(false);
    setError(null);
    setUrlError(null);
    setTextError(null);
    setAnalysisResult(null);
    setAnalyzedUrl(null);

    startProgressSimulation(10);
    
    try {
      const result = await analyzeText(inputText);
      saveAnalysisResult(result, inputText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      finishProgress();
    }
  };

  const runUrlAnalysis = async () => {
    if (!url.trim()) {
      setUrlError('Please enter a URL to analyze.');
      return;
    }
    
    // --- Enhanced URL Validation ---
    try {
      const validUrl = new URL(url);
      if (validUrl.protocol !== 'http:' && validUrl.protocol !== 'https:') {
        throw new Error("URL must use the 'http://' or 'https://' protocol.");
      }
    } catch (e) {
      let errorMessage = "The URL format is invalid. Please provide a complete URL, including 'http://' or 'https://'.";
      if (e instanceof Error && e.message.includes('protocol')) {
        errorMessage = e.message;
      }
      setUrlError(errorMessage);
      return;
    }
    // --- End of Validation ---

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
      setProgress(10);
      const response = await fetch(`${CORS_PROXY}${url}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content. Server responded with status: ${response.status}`);
      }
      
      setProgress(40);
      const htmlText = await response.text();

      if (new Blob([htmlText]).size > MAX_HTML_SIZE_BYTES) {
        throw new Error(`The page content is too large to process (limit: ${MAX_HTML_SIZE_BYTES / 1024 / 1024}MB).`);
      }
      
      setProgress(60);
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const paragraphs = Array.from(doc.querySelectorAll('p'));
      const extractedText = paragraphs.map(p => p.textContent).join('\n').trim();

      if (!extractedText || extractedText.length < 200) {
        throw new Error('Could not extract a meaningful article from the URL. The page might be structured in a non-standard way or content is loaded with JavaScript.');
      }
      
      setInputText(extractedText);
      setIsFetchingUrl(false); // Switch message to "Analyzing"
      startProgressSimulation(60);
      
      const result = await analyzeText(extractedText);
      saveAnalysisResult(result, extractedText, url);

    } catch (err) {
      clearTimeout(timeoutId);
      let errorMessage = 'An unknown error occurred while fetching the URL.';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'The request timed out. The website may be slow or offline.';
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
    setInputText(EXAMPLE_TEXT);
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
    });
    setAnalyzedUrl(item.url || null);
    setCurrentAnalysisId(item.id);
    setError(null);
    setTextError(null);
    setUrlError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-slate-400 mb-8 text-lg">
            Paste a news article, social media post, or URL below. Veritas AI will analyze it for signs of misinformation and provide a detailed report.
          </p>
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

          <div className="mt-8">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-xl border border-slate-700">
                <ProgressBar 
                  progress={progress}
                  message={isFetchingUrl ? 'Fetching & Parsing URL...' : 'Analyzing Text...'}
                />
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500/30 rounded-lg text-red-200 text-center">
                <strong>Error:</strong> {error}
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
                <div className="p-6 bg-slate-800 border border-yellow-500/30 rounded-xl text-center">
                  <h3 className="text-lg font-semibold text-yellow-300">Analysis Below Threshold</h3>
                  <p className="text-slate-400 mt-2">
                    The analysis was completed, but its confidence score of{' '}
                    <strong className="text-slate-200">{Math.round(analysisResult.confidenceScore * 100)}%</strong>{' '}
                    is below your set threshold of{' '}
                    <strong className="text-slate-200">{Math.round(confidenceThreshold * 100)}%</strong>.
                  </p>
                  <p className="text-slate-500 text-sm mt-3">
                    Adjust the threshold slider above to view the result.
                  </p>
                </div>
              )
            )}
          </div>
          
          <AnalysisHistory
            history={history}
            onSelect={handleSelectHistory}
            onClear={handleClearHistory}
            isLoading={isLoading || isFetchingUrl}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;