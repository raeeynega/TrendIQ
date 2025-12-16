export type StockData = {
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
};

function generateStockData(days: number, initialPrice: number, volatility: number): StockData[] {
  const data: StockData[] = [];
  let currentDate = new Date();
  let currentPrice = initialPrice;

  for (let i = 0; i < days; i++) {
    const changePercent = 2 * volatility * Math.random() - volatility;
    const open = currentPrice;
    const high = open * (1 + (Math.random() * volatility) / 2);
    const low = open * (1 - (Math.random() * volatility) / 2);
    const close = open * (1 + changePercent);
    currentPrice = close;

    data.unshift({
      date: new Date(currentDate).toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return data;
}

export const mockStockData: StockData[] = generateStockData(30, 150, 0.05);
