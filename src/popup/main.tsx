import React from "react";
import { createRoot } from "react-dom/client";
import QueryProvider from "@provider/Query";
import CurrencyProvider from "@provider/Currency";
import CoinGeckoProvider from "../provider/CoinGecko";
import Main from ".";

// Inject CSS
import MainCss from "./index.css";
const mainStyle = document.createElement("style");
document.head.appendChild(mainStyle);
mainStyle.textContent = MainCss;

import SliderCss from "rc-slider/assets/index.css";
const sliderStyle = document.createElement("style");
document.head.appendChild(sliderStyle);
sliderStyle.textContent = SliderCss;

// Svg Sprite
import "virtual:svg-icons-register";

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
