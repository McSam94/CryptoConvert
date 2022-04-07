import * as React from "react";
import { useQuery } from "react-query";
import { MESSAGE_EVENTS } from "@constants/events";

export interface Market {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

export const CoinGeckoContext = React.createContext<{
  getMarkets: (currency: string) => void;
  isFetchingMarkets: boolean;
  markets: Array<Market>;
}>({
  getMarkets: () => {},
  isFetchingMarkets: false,
  markets: [],
});

const CoinGeckoProvider: React.FC = ({ children }) => {
  const [markets, setMarkets] = React.useState<Array<Market>>([]);
  const [isFetchingMarkets, setIsFetchingMarkets] =
    React.useState<boolean>(false);

  const getMarkets = React.useCallback((currency) => {
    setIsFetchingMarkets(true);
    chrome.runtime.sendMessage(
      { type: MESSAGE_EVENTS.GET_MARKETS, payload: { currency } },
      ({ markets }) => {
        setMarkets(markets);
        setIsFetchingMarkets(false);
      }
    );
  }, []);

  return (
    <CoinGeckoContext.Provider
      value={{
        getMarkets,
        isFetchingMarkets,
        markets,
      }}
    >
      {children}
    </CoinGeckoContext.Provider>
  );
};

export default CoinGeckoProvider;
