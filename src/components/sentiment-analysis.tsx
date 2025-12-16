"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeNewsSentiment,
  type AnalyzeNewsSentimentOutput,
} from "@/ai/flows/analyze-news-sentiment";
import { fetchFinancialNews } from "@/ai/flows/fetch-financial-news";
import type { FetchFinancialNewsOutput } from "@/ai/flows/fetch-financial-news";
import { Loader2, TrendingUp, TrendingDown, Minus, Newspaper, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  articleContent: z
    .string()
    .min(50, "Article content must be at least 50 characters."),
});

export default function SentimentAnalysis() {
  const [loading, setLoading] = useState(false);
  const [fetchingNews, setFetchingNews] = useState(false);
  const [result, setResult] = useState<AnalyzeNewsSentimentOutput | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "AI-STOCK",
      articleContent: `Visionary AI Inc. (ticker: AI-STOCK) today announced a breakthrough in their quantum computing division, which analysts predict could revolutionize the industry. The company's stock surged 15% in after-hours trading following the news. "This is a game-changer," said one market expert.`,
    },
  });

  async function onFetchNews() {
    setFetchingNews(true);
    const topic = form.getValues("topic");
    try {
      const { articles }: FetchFinancialNewsOutput = await fetchFinancialNews({ topic });
      if (articles.length > 0) {
        // For simplicity, we'll use the first article's content.
        // A real app might let the user choose or analyze all.
        form.setValue("articleContent", articles[0].content);
        toast({
          title: "News Fetched",
          description: `Loaded latest news for ${topic} from ${articles[0].source}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "No News Found",
          description: `Could not find any news for ${topic}.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Fetch News",
        description: "An error occurred while fetching financial news.",
      });
    } finally {
      setFetchingNews(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    try {
      const response = await analyzeNewsSentiment({
        articleContent: values.articleContent,
        ticker: values.topic, // Use topic as the ticker for analysis
      });
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the news article.",
      });
    } finally {
      setLoading(false);
    }
  }
  
  const getSentimentProps = (label: string | undefined) => {
    switch (label?.toLowerCase()) {
      case 'positive':
        return {
          icon: <TrendingUp className="h-8 w-8 text-green-500" />,
          badgeVariant: 'default',
          badgeClass: 'bg-green-500/80 hover:bg-green-500/90 text-white',
        };
      case 'negative':
        return {
          icon: <TrendingDown className="h-8 w-8 text-red-500" />,
          badgeVariant: 'destructive',
          badgeClass: 'bg-red-500/80 hover:bg-red-500/90',
        };
      default:
        return {
          icon: <Minus className="h-8 w-8 text-gray-500" />,
          badgeVariant: 'secondary',
          badgeClass: 'bg-gray-500/80 hover:bg-gray-500/90',
        };
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-6 w-6" /> News Sentiment Analyzer
          </CardTitle>
          <CardDescription>
            Analyze the sentiment of a news article for a specific stock or forex pair.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock or Forex Pair</FormLabel>
                    <div className="flex gap-2">
                       <Input placeholder="e.g., AAPL, EURUSD, TSLA" {...field} />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onFetchNews}
                        disabled={fetchingNews}
                        className="whitespace-nowrap"
                      >
                        {fetchingNews ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="mr-2 h-4 w-4" />
                        )}
                        Fetch News
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="articleContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the news article text here, or use 'Fetch News'..."
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {loading ? "Analyzing..." : "Analyze Sentiment"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {(loading || result) && (
        <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
            <CardDescription>The AI-powered sentiment analysis of the article.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p>Analyzing sentiment...</p>
              </div>
            )}
            {result && !loading && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sentiment</p>
                    <Badge className={getSentimentProps(result.sentimentLabel).badgeClass}>
                        {result.sentimentLabel}
                    </Badge>
                  </div>
                  {getSentimentProps(result.sentimentLabel).icon}
                </div>

                <div>
                    <p className="text-sm font-medium text-muted-foreground">Sentiment Score</p>
                    <p className="text-2xl font-bold">{result.sentimentScore.toFixed(2)}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-muted-foreground">Summary</p>
                    <p className="text-sm text-foreground/90">{result.summary}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
