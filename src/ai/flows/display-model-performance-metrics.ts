'use server';

/**
 * @fileOverview Calculates and displays performance metrics (MSE, MAE, RMSE) for stock prediction models.
 *
 * - displayModelPerformanceMetrics - A function that calculates and returns the performance metrics.
 * - DisplayModelPerformanceMetricsInput - The input type for the displayModelPerformanceMetrics function.
 * - DisplayModelPerformanceMetricsOutput - The return type for the displayModelPerformanceMetrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplayModelPerformanceMetricsInputSchema = z.object({
  predictedValues: z.array(z.number()).describe('Array of predicted stock prices.'),
  actualValues: z.array(z.number()).describe('Array of actual stock prices.'),
});
export type DisplayModelPerformanceMetricsInput = z.infer<typeof DisplayModelPerformanceMetricsInputSchema>;

const DisplayModelPerformanceMetricsOutputSchema = z.object({
  mse: z.number().describe('Mean Squared Error.'),
  mae: z.number().describe('Mean Absolute Error.'),
  rmse: z.number().describe('Root Mean Squared Error.'),
});
export type DisplayModelPerformanceMetricsOutput = z.infer<typeof DisplayModelPerformanceMetricsOutputSchema>;

export async function displayModelPerformanceMetrics(input: DisplayModelPerformanceMetricsInput): Promise<DisplayModelPerformanceMetricsOutput> {
  return displayModelPerformanceMetricsFlow(input);
}

const displayModelPerformanceMetricsPrompt = ai.definePrompt({
  name: 'displayModelPerformanceMetricsPrompt',
  input: {schema: DisplayModelPerformanceMetricsInputSchema},
  output: {schema: DisplayModelPerformanceMetricsOutputSchema},
  prompt: `You are an expert in evaluating the performance of stock prediction models.
  Calculate the Mean Squared Error (MSE), Mean Absolute Error (MAE), and Root Mean Squared Error (RMSE) based on the following predicted and actual stock values.

  Predicted Values: {{{predictedValues}}}
  Actual Values: {{{actualValues}}}

  Return the calculated MSE, MAE, and RMSE values.
  Make sure they are numbers.
  `,
});

const displayModelPerformanceMetricsFlow = ai.defineFlow(
  {
    name: 'displayModelPerformanceMetricsFlow',
    inputSchema: DisplayModelPerformanceMetricsInputSchema,
    outputSchema: DisplayModelPerformanceMetricsOutputSchema,
  },
  async input => {
    const {predictedValues, actualValues} = input;

    // Calculate MSE
    const mse = predictedValues.reduce((sum, val, index) => sum + Math.pow(val - actualValues[index], 2), 0) / predictedValues.length;

    // Calculate MAE
    const mae = predictedValues.reduce((sum, val, index) => sum + Math.abs(val - actualValues[index]), 0) / predictedValues.length;

    // Calculate RMSE
    const rmse = Math.sqrt(mse);

    return {
      mse: mse,
      mae: mae,
      rmse: rmse,
    };
  }
);
