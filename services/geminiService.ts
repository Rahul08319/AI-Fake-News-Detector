
import { GoogleGenAI, Type } from "@google/genai";
import { type AnalysisResultData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GEMINI_MODEL_VERSION = 'gemini-2.5-flash';

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    classification: {
      type: Type.STRING,
      enum: ['Trustworthy', 'Likely Fake', 'Uncertain'],
      description: 'The final classification of the news.',
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: 'A score from 0.0 to 1.0 indicating the confidence in the classification.',
    },
    explanation: {
      type: Type.STRING,
      description: 'A detailed explanation for the classification, outlining the reasoning.',
    },
    keyPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: 'A list of key points or red flags found in the text that support the conclusion.',
    },
  },
  required: ['classification', 'confidenceScore', 'explanation', 'keyPoints'],
};

export const analyzeText = async (text: string): Promise<AnalysisResultData> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_VERSION,
      contents: `Analyze the following text and determine if it is likely fake news or trustworthy. Here is the text: "${text}"`,
      config: {
        systemInstruction: `You are a sophisticated AI fact-checker named Veritas. Your purpose is to analyze text from news articles, social media posts, or other sources to determine its likelihood of being fake news or a rumor. You must provide a clear classification, a confidence score, a detailed explanation of your reasoning, and a list of key points that support your conclusion. Your analysis should be unbiased, based on logical fallacies, emotional language, source credibility (if discernible), and other common indicators of misinformation. Respond ONLY in the JSON format specified in the schema.`,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Ensure the confidence score is between 0 and 1.
    result.confidenceScore = Math.max(0, Math.min(1, result.confidenceScore));

    return result as AnalysisResultData;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from the AI model.");
  }
};