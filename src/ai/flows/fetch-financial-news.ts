'use server';

/**
 * @fileOverview An AI agent that fetches mock financial news articles for a given topic.
 *
 * - fetchFinancialNews - A function that returns a list of mock news articles.
 * - FetchFinancialNewsInput - The input type for the fetchFinancialNews function.
 * - FetchFinancialNewsOutput - The return type for the fetchFinancialNews function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FetchFinancialNewsInputSchema = z.object({
  topic: z.string().describe('The financial topic to fetch news for (e.g., a stock ticker or currency pair like EURUSD).'),
});
export type FetchFinancialNewsInput = z.infer<typeof FetchFinancialNewsInputSchema>;

const ArticleSchema = z.object({
  headline: z.string(),
  content: z.string(),
  source: z.enum(['Myfxbook', 'Forex Factory', 'Market News']),
});

const FetchFinancialNewsOutputSchema = z.object({
  articles: z.array(ArticleSchema).describe('A list of fetched news articles.'),
});
export type FetchFinancialNewsOutput = z.infer<typeof FetchFinancialNewsOutputSchema>;


export async function fetchFinancialNews(
  input: FetchFinancialNewsInput
): Promise<FetchFinancialNewsOutput> {
  return fetchFinancialNewsFlow(input);
}


const fetchFinancialNewsFlow = ai.defineFlow(
  {
    name: 'fetchFinancialNewsFlow',
    inputSchema: FetchFinancialNewsInputSchema,
    outputSchema: FetchFinancialNewsOutputSchema,
  },
  async ({ topic }) => {
    // In a real application, you would integrate with a news API here.
    // For this simulation, we'll return mock data based on the topic.

    const mockArticles = [
      {
        headline: `Analysis: ${topic} Rallies on Positive Economic Data`,
        content: `The ${topic} currency pair surged today following the release of strong manufacturing PMI data. Analysts from Forex Factory suggest this could signal a bullish trend, with many traders going long. The sentiment appears overwhelmingly positive.`,
        source: 'Forex Factory' as const,
      },
      {
        headline: `${topic} Faces Headwinds Amid Global Uncertainty`,
        content: `According to Myfxbook community sentiment, the ${topic} pair is facing significant resistance. Global trade tensions and talks of interest rate hikes are creating a bearish outlook for the near term. Caution is advised.`,
        source: 'Myfxbook' as const,
      },
      {
        headline: `Market Makers See Volatility Ahead for ${topic}`,
        content: `Central bank announcements expected later this week are likely to introduce significant volatility for ${topic}. While short-term predictions are mixed, the long-term outlook remains dependent on fiscal policy decisions.`,
        source: 'Market News' as const,
      },
    ];

    return {
      articles: mockArticles,
    };
  }
);
