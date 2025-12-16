'use server';

/**
 * @fileOverview An AI agent that analyzes the sentiment of news articles related to specific stocks.
 *
 * - analyzeNewsSentiment - A function that handles the news sentiment analysis process.
 * - AnalyzeNewsSentimentInput - The input type for the analyzeNewsSentiment function.
 * - AnalyzeNewsSentimentOutput - The return type for the analyzeNewsSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNewsSentimentInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the news article to analyze.'),
  ticker: z.string().describe('The ticker symbol of the stock.'),
});
export type AnalyzeNewsSentimentInput = z.infer<
  typeof AnalyzeNewsSentimentInputSchema
>;

const AnalyzeNewsSentimentOutputSchema = z.object({
  sentimentScore: z
    .number()
    .describe(
      'A numerical score representing the sentiment of the article. Positive values indicate positive sentiment, negative values indicate negative sentiment, and values close to zero indicate neutral sentiment.'
    ),
  sentimentLabel: z
    .string()
    .describe(
      'A label describing the sentiment of the article (e.g., Positive, Negative, Neutral).'
    ),
  summary: z
    .string()
    .describe('A brief summary of the article and its sentiment.'),
});
export type AnalyzeNewsSentimentOutput = z.infer<
  typeof AnalyzeNewsSentimentOutputSchema
>;

export async function analyzeNewsSentiment(
  input: AnalyzeNewsSentimentInput
): Promise<AnalyzeNewsSentimentOutput> {
  return analyzeNewsSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNewsSentimentPrompt',
  input: {schema: AnalyzeNewsSentimentInputSchema},
  output: {schema: AnalyzeNewsSentimentOutputSchema},
  prompt: `You are a financial analyst specializing in sentiment analysis of news articles related to stocks.

  Analyze the following news article content and determine its sentiment towards the stock with ticker symbol: {{{ticker}}}.

  Article Content: {{{articleContent}}}

  Provide a sentiment score, a sentiment label (Positive, Negative, or Neutral), and a brief summary of the article and its sentiment.

  Ensure the sentimentScore accurately reflects the article's sentiment, with positive values for positive sentiment, negative values for negative sentiment, and values near zero for neutral sentiment. The sentimentLabel should correspond to the sentimentScore.

  Output format: {sentimentScore: number, sentimentLabel: string, summary: string}`,
});

const analyzeNewsSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeNewsSentimentFlow',
    inputSchema: AnalyzeNewsSentimentInputSchema,
    outputSchema: AnalyzeNewsSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
