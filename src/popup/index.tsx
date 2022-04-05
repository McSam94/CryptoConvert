import * as React from "react";
import Icon from "@components/Icon";
import CoinInput from "@components/CoinInput";
import CurrencyInput from "@components/CurrencyInput";
import { Market } from "@provider/CoinCecko";
import useCoinGecko from "@hooks/CoinGecko";

function App() {
  const { markets, getMarkets } = useCoinGecko();
  const [coinInput, setCoinInput] = React.useState<{
    coinInfo: Market | null;
    value: number | string;
  }>({
    coinInfo: null,
    value: "",
  });
  const [currencyInput, setCurrencyInput] = React.useState<{
    currency: string;
    value: number | string;
  }>({
    currency: "USD",
    value: "",
  });

  React.useEffect(() => {
    setCoinInput((prevState) => ({
      ...prevState,
      coinInfo: markets?.[0] ?? null,
    }));
  }, [markets]);

  React.useEffect(() => {
    if (!coinInput.coinInfo) return;
    setCurrencyInput((prevState) => ({
      ...prevState,
      value:
        coinInput.value === ""
          ? ""
          : (coinInput.coinInfo?.current_price ?? 0) * +coinInput.value,
    }));
  }, [coinInput]);

  React.useEffect(() => {
    getMarkets(currencyInput.currency);
  }, [currencyInput.currency]);

  return (
    <>
      <div className="min-w-[12rem] min-h-[30rem] p-8">
        <div className="flex flex-col items-center space-y-10">
          <div className="my-2 text-3xl font-bold">Crypto Convert</div>
          <CoinInput
            value={coinInput.value}
            coinValue={coinInput.coinInfo}
            onInput={(value) =>
              setCoinInput((prevState) => ({ ...prevState, value }))
            }
            onCoinSelect={(coinInfo) =>
              setCoinInput((prevState) => ({ ...prevState, coinInfo }))
            }
          />
          <div className="p-2 bg-gray-300/50 rounded-full">
            <Icon name="swap" color="black" />
          </div>
          <CurrencyInput
            value={currencyInput.value}
            currencyValue={currencyInput.currency}
            onInput={(value) =>
              setCurrencyInput((prevState) => ({ ...prevState, value }))
            }
            onCurrencySelect={(currency) =>
              setCurrencyInput((prevState) => ({ ...prevState, currency }))
            }
          />
        </div>
      </div>
    </>
  );
}

export default App;
