import { CURRENCY } from "@constants/currency";
import { MESSAGE_EVENTS } from "@constants/events";
import * as React from "react";

export const CurrencyContext = React.createContext<{
  currencies: Array<string>;
}>({
  currencies: [],
});

const CurrencyProvider: React.FC = ({ children }) => {
  return (
    <CurrencyContext.Provider value={{ currencies: CURRENCY }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
