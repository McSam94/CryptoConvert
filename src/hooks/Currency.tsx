import { CurrencyContext } from "@provider/Currency";
import * as React from "react";

const useCurrency = () => {
  return React.useContext(CurrencyContext);
};

export default useCurrency;
