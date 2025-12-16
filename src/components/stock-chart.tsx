"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { StockData } from "@/lib/mock-data";
import { useTheme } from "next-themes";

interface StockChartProps {
  data: StockData[];
  ticker: string;
}

export default function StockChart({ data, ticker }: StockChartProps) {
    const { theme } = useTheme();

    const chartConfig = {
        price: {
          label: "Price (USD)",
          color: theme === 'dark' ? 'hsl(var(--primary))' : 'hsl(var(--primary))',
        },
      } satisfies ChartConfig;

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
      <CardHeader>
        <CardTitle>{ticker} Historical Prices</CardTitle>
        <CardDescription>Last 30 days of simulated trading data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                domain={["dataMin - 5", "dataMax + 5"]}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <ChartTooltip
                cursor={{
                  stroke: "hsl(var(--border))",
                  strokeWidth: 2,
                  strokeDasharray: "3 3",
                }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke={chartConfig.price.color}
                strokeWidth={2}
                dot={false}
                name="Close Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
