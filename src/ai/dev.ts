import { config } from 'dotenv';
config();

import '@/ai/flows/train-stock-prediction-model.ts';
import '@/ai/flows/display-model-performance-metrics.ts';
import '@/ai/flows/analyze-news-sentiment.ts';