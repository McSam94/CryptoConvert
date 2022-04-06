import * as React from "react";
import Icon from "@components/Icon";
import CoinInput from "@components/CoinInput";
import CurrencyInput from "@components/CurrencyInput";
import { Market } from "@provider/CoinCecko";
import useCoinGecko from "@hooks/CoinGecko";
import { MESSAGE_EVENTS } from "@constants/events";

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

  const retrieveCurrency = React.useCallback(async () => {
    const local = await chrome.storage.local.get("currency");
    console.log(
      "🚀 ~ file: index.tsx ~ line 28 ~ retrieveCurrency ~ currency",
      local
    );

    setCurrencyInput((prevState) => ({
      ...prevState,
      currency: local?.currency ?? "USD",
    }));
  }, []);

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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id ?? 0, {
        type: MESSAGE_EVENTS.SET_CURRENCY,
        payload: { currency: currencyInput.currency },
      });
    });
  }, [currencyInput.currency]);

  React.useEffect(() => {
    retrieveCurrency();
  }, []);

  return (
    <>
      <div className="min-w-[24rem] min-h-[30rem] bg-gray-800 text-white px-6">
        <div className="flex flex-col h-full items-center space-y-8">
          <div className="my-2 text-4xl font-bold border-b py-4 border-gray-50 w-full text-center">
            CRYPTO CONVERT
          </div>
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
          <div className="p-2 bg-gray-200/50 rounded-full">
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
          <a href="https://buymeacoffee.com/oh8yMYq" target="_blank">
            <img
              className="h-10 cursor-pointer"
              src={chrome.runtime.getURL("src/images/bmc-button.png")}
              alt="bmc"
            />
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
