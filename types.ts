export enum Classification {
  TRUSTWORTHY = 'Trustworthy',
  LIKELY_FAKE = 'Likely Fake',
  UNCERTAIN = 'Uncertain',
}

export interface VerificationMetrics {
  sensationalism: number; // 0-100 (Lower is better)
  sourceTransparency: number; // 0-100 (Higher is better)
  emotionalBias: number; // 0-100 (Lower is better)
  logicalCoherence: number; // 0-100 (Higher is better)
  factualCorroboration: number; // 0-100 (Higher is better)
}

export interface SentimentProfile {
  label: 'Objective' | 'Balanced' | 'Alarmist' | 'Polarizing' | 'Sensational' | 'Manipulative';
  intensity: number; // 0-100
}

export interface AnalysisResultData {
  classification: Classification;
  confidenceScore: number;
  explanation: string;
  keyPoints: string[];
  metrics?: VerificationMetrics;
  sentiment?: SentimentProfile;
  verdictSummary?: string;
  suggestedActions?: string[];
  analyzedYear?: number;
  mode?: 'gemini-ai' | 'local-neural-heuristics';
}

export interface AnalysisHistoryItem extends AnalysisResultData {
  id: string;
  text: string;
  timestamp: string;
  url?: string;
  starred?: boolean;
}

export interface PresetClaim {
  id: string;
  title: string;
  category: 'Tech & AI' | 'Health & Science' | 'World & Politics' | 'Viral Rumors';
  sampleText: string;
  sourceLabel: string;
  year: number;
}
