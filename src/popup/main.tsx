import React from "react";
import { createRoot } from "react-dom/client";
import Main from ".";
import QueryProvider from "@provider/Query";

// Inject CSS
import MainCss from "./index.css";
const style = document.createElement("style");
document.head.append(style);
style.textContent = MainCss;

// Svg Sprite
import "virtual:svg-icons-register";
import CoinGeckoProvider from "../provider/CoinCecko";
import CurrencyProvider from "@provider/Currency";

// React 18 way to initialize the react-dom
const rootContainer = document.getElementById("root");
if (!rootContainer)
  throw new Error(
    'Failed to find the root element. Please defined a element with id "root" in your index.html'
  );
const root = createRoot(rootContainer);
root.render(
  <React.StrictMode>
    <QueryProvider>
      <CoinGeckoProvider>
        <CurrencyProvider>
          <Main />
        </CurrencyProvider>
      </CoinGeckoProvider>
    </QueryProvider>
  </React.StrictMode>
);
