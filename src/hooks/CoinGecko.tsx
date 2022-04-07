import * as React from "react";
import { CoinGeckoContext } from "@provider/CoinGecko";

const useCoinGecko = () => {
  return React.useContext(CoinGeckoContext);
};

export default useCoinGecko;
