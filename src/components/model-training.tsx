"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  trainStockPredictionModel,
  type TrainStockPredictionModelOutput,
} from "@/ai/flows/train-stock-prediction-model";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Bot, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  ticker: z.string().min(1, "Ticker is required.").max(10),
  modelType: z.enum(["LSTM", "ARIMA", "Prophet"]),
});

export default function ModelTraining() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] =
    useState<TrainStockPredictionModelOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "AI-STOCK",
      modelType: "LSTM",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);

    try {
      const response = await trainStockPredictionModel({
        historicalData: "...", // This would be the actual data
        modelType: values.modelType,
        trainingParams: JSON.stringify({ ticker: values.ticker }),
      });
      setResult(response);
      setProgress(100);
      toast({
        title: "Training Complete",
        description: `Model ${response.modelId} trained successfully.`,
      });
    } catch (error) {
      console.error(error);
      setResult({
        status: "failure",
        modelId: "",
        modelMetrics: "",
        message: "An unexpected error occurred during training.",
      });
      toast({
        variant: "destructive",
        title: "Training Failed",
        description: "Could not train the prediction model.",
      });
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-6 w-6" /> Train a New Prediction Model
          </CardTitle>
          <CardDescription>
            Select a model type and provide a stock ticker to train a new
            prediction model.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="ticker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Ticker</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AAPL, GOOGL, MSFT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LSTM">LSTM</SelectItem>
                        <SelectItem value="ARIMA">ARIMA</SelectItem>
                        <SelectItem value="Prophet">Prophet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="mr-2 h-4 w-4" />
                )}
                {loading ? "Training Model..." : "Start Training"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {(loading || result) && (
        <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Training Status</CardTitle>
            <CardDescription>
              {loading
                ? "Your model is being trained. This may take a moment."
                : "Results of the model training process."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center">
            {loading && (
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground">
                  Training in progress... {progress}%
                </p>
              </div>
            )}
            {result && !loading && (
              <Alert
                variant={result.status === "success" ? "default" : "destructive"}
                className={result.status === "success" ? "border-green-500/50 text-green-700 dark:text-green-400" : ""}
              >
                {result.status === "success" ? (
                  <CheckCircle className={`h-4 w-4 ${result.status === "success" ? "text-green-500" : ""}`} />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {result.status === "success"
                    ? "Training Successful"
                    : "Training Failed"}
                </AlertTitle>
                <AlertDescription>
                  {result.message}
                  {result.status === "success" && (
                    <div className="mt-2 text-xs text-foreground/80 space-y-1">
                      <p><strong>Model ID:</strong> {result.modelId}</p>
                      <p><strong>Metrics:</strong> {result.modelMetrics}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
