import { Bot, LineChart, Newspaper } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/dashboard";
import ModelTraining from "@/components/model-training";
import SentimentAnalysis from "@/components/sentiment-analysis";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-black">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg shadow-md">
            <Icons.Logo className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">TrendIQ</h1>
        </div>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-4 md:gap-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3">
            <TabsTrigger value="dashboard">
              <LineChart className="mr-2 h-4 w-4" />
              Prediction Dashboard
            </TabsTrigger>
            <TabsTrigger value="training">
              <Bot className="mr-2 h-4 w-4" />
              Model Training
            </TabsTrigger>
            <TabsTrigger value="sentiment">
              <Newspaper className="mr-2 h-4 w-4" />
              News Sentiment
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-4">
            <Dashboard />
          </TabsContent>
          <TabsContent value="training" className="mt-4">
            <ModelTraining />
          </TabsContent>
          <TabsContent value="sentiment" className="mt-4">
            <SentimentAnalysis />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
