import { MESSAGE_EVENTS } from "@constants/events";
import * as React from "react";

export const CurrencyContext = React.createContext<{
  currencies: Array<string>;
  isFetchingCurrencies: boolean;
}>({
  currencies: [],
  isFetchingCurrencies: false,
});

const CurrencyProvider: React.FC = ({ children }) => {
  const [currencies, setCurrencies] = React.useState<Array<string>>([]);
  const [isFetchingCurrencies, setIsFetchingCurrencies] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    setIsFetchingCurrencies(true);
    chrome.runtime.sendMessage(
      { type: MESSAGE_EVENTS.GET_CURRENCY },
      ({ currencies }) => {
        setCurrencies(currencies);
        setIsFetchingCurrencies(false);
      }
    );
  }, []);

  return (
    <CurrencyContext.Provider value={{ currencies, isFetchingCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
