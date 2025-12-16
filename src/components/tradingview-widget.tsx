"use client";

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

interface TradingViewWidgetProps {
  ticker: string;
}

function TradingViewWidget({ ticker }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (container.current && ticker) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;

      const config = {
        autosize: true,
        symbol: ticker,
        interval: "D",
        timezone: "Etc/UTC",
        theme: theme === 'dark' ? 'dark' : 'light',
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview_widget_container_for_real"
      };

      script.innerHTML = JSON.stringify(config);
      
      const widgetContainerId = "tradingview_widget_container_for_real";
      let widgetContainer = container.current.querySelector(`#${widgetContainerId}`);

      if (!widgetContainer) {
          widgetContainer = document.createElement('div');
          widgetContainer.id = widgetContainerId;
          widgetContainer.style.height = '100%';
          widgetContainer.style.width = '100%';
          container.current.appendChild(widgetContainer);
      }
      
      // Clear previous widget and script
      while (widgetContainer.firstChild) {
        widgetContainer.removeChild(widgetContainer.firstChild);
      }
      const existingScript = container.current.querySelector('script');
      if (existingScript) {
        container.current.removeChild(existingScript);
      }

      widgetContainer.appendChild(script);
    }
  }, [ticker, theme]);

  return (
    <div className="h-[550px] w-full" ref={container}>
      <div id="tradingview_widget_container_for_real" className="h-full w-full"></div>
    </div>
  );
}

export default memo(TradingViewWidget);
