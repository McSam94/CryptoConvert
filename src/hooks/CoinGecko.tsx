import * as React from "react";
import { CoinGeckoContext } from "@provider/CoinCecko";

const useCoinGecko = () => {
  return React.useContext(CoinGeckoContext);
};

export default useCoinGecko;
