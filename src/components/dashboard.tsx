"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Loader2,
  BarChart,
} from "lucide-react";
import StockChart from "@/components/stock-chart";
import { mockStockData, type StockData } from "@/lib/mock-data";
import {
  displayModelPerformanceMetrics,
  type DisplayModelPerformanceMetricsOutput,
} from "@/ai/flows/display-model-performance-metrics";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [ticker, setTicker] = useState("AI-STOCK");
  const [inputTicker, setInputTicker] = useState("AI-STOCK");
  const [stockData, setStockData] = useState<StockData[]>(mockStockData);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [lastClose, setLastClose] = useState<number | null>(null);
  const [metrics, setMetrics] =
    useState<DisplayModelPerformanceMetricsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const heroImage = PlaceHolderImages[0];

  const handleSearch = async () => {
    if (!inputTicker) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a stock ticker.",
      });
      return;
    }
    setLoading(true);
    setTicker(inputTicker);

    try {
      // Simulate API call to fetch new data and run prediction
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const lastPrice = stockData.length > 0 ? stockData[stockData.length - 1].close : 150;
      setLastClose(lastPrice);
      const newPrediction = lastPrice * (1 + (Math.random() - 0.45) * 0.1);
      setPrediction(newPrediction);

      // Simulate metrics calculation
      const actual = stockData.slice(-10).map((d) => d.close);
      const predicted = actual.map(
        (price) => price * (1 + (Math.random() - 0.5) * 0.05)
      );
      const metricsResult = await displayModelPerformanceMetrics({
        actualValues: actual,
        predictedValues: predicted,
      });
      setMetrics(metricsResult);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to fetch stock data or run prediction.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isTrendingUp = prediction !== null && lastClose !== null && prediction > lastClose;

  return (
    <div className="space-y-6">
      <div className="relative w-full h-60 md:h-72 rounded-xl overflow-hidden shadow-lg">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Stock Prediction Dashboard
          </h2>
          <p className="text-lg text-slate-200 mt-2 max-w-2xl">
            Leverage AI to forecast market movements. Enter a stock ticker to
            get started.
          </p>
          <div className="mt-6 flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="e.g., AAPL, GOOGL, MSFT"
              className="bg-white/95 text-foreground h-12 text-lg"
              value={inputTicker}
              onChange={(e) => setInputTicker(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button size="lg" onClick={handleSearch} disabled={loading} className="h-12">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StockChart data={stockData} ticker={ticker} />
        </div>
        <div className="space-y-6">
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Next-Day Prediction
              </CardTitle>
              {loading ? <Skeleton className="h-6 w-6 rounded-full" /> : (isTrendingUp ? (
                <TrendingUp className="h-6 w-6 text-green-500" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-500" />
              ))}
            </CardHeader>
            <CardContent>
              {loading ? (
                <>
                 <Skeleton className="h-10 w-3/4 mb-2" />
                 <Skeleton className="h-4 w-1/2" />
                </>
              ) : (
                <>
                <div className="text-4xl font-bold">
                  ${prediction?.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Prediction for {new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString()}
                </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Model Performance
              </CardTitle>
              <BarChart className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <div className="space-y-4 mt-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div> : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    MSE <HelpCircle className="h-3 w-3 ml-1" />
                  </span>
                  <span className="font-medium">{metrics?.mse.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    MAE <HelpCircle className="h-3 w-3 ml-1" />
                  </span>
                  <span className="font-medium">{metrics?.mae.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    RMSE <HelpCircle className="h-3 w-3 ml-1" />
                  </span>
                  <span className="font-medium">
                    {metrics?.rmse.toFixed(4)}
                  </span>
                </div>
              </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
