export enum Classification {
  TRUSTWORTHY = 'Trustworthy',
  LIKELY_FAKE = 'Likely Fake',
  UNCERTAIN = 'Uncertain',
}

export interface AnalysisResultData {
  classification: Classification;
  confidenceScore: number;
  explanation: string;
  keyPoints: string[];
}

export interface AnalysisHistoryItem extends AnalysisResultData {
  id: string;
  text: string;
  timestamp: string;
  url?: string;
}
