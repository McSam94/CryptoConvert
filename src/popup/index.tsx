import * as React from "react";
import Slider from "rc-slider";
import CurrencyInput from "@components/CurrencyInput";
import { MESSAGE_EVENTS } from "@constants/events";
import ReportIssue from "./report-issue";
import BuyMeCoffee from "./buy-me-coffee";
import { log } from "@utils/log";

function App() {
  const [currencyInput, setCurrencyInput] = React.useState<{
    currency: string;
    value: number | string;
  }>({
    currency: "USD",
    value: "",
  });
  const [interval, setInterval] = React.useState<number>(1);

  const retrieveCurrency = React.useCallback(async () => {
    const local = await chrome.storage.local.get("currency");
    if (!local) return;

    log(`Successfully retrieved currency: ${local?.currency}`);
    setCurrencyInput((prevState) => ({
      ...prevState,
      currency: local?.currency ?? "USD",
    }));
  }, []);

  const retrieveInterval = React.useCallback(async () => {
    const local = await chrome.storage.local.get("interval");
    if (!local) return;

    log(`Successfully retrieved interval: ${local?.interval}`);
    setInterval(local?.interval ?? 1);
  }, []);

  const onIntervalChange = React.useCallback(async (val) => {
    setInterval(val);
  }, []);

  React.useEffect(() => {
    chrome.runtime.sendMessage({
      type: MESSAGE_EVENTS.SET_CURRENCY,
      payload: { currency: currencyInput.currency },
    });
  }, [currencyInput.currency]);

  React.useEffect(() => {
    chrome.runtime.sendMessage({
      type: MESSAGE_EVENTS.SET_INTERVAL,
      payload: { interval },
    });
  }, [interval]);

  React.useEffect(() => {
    retrieveCurrency();
    retrieveInterval();
  }, []);

  return (
    <>
      <div className="min-w-[24rem] min-h-[30rem] bg-gray-800 text-white px-6">
        <div className="flex flex-col h-screen items-center space-y-6">
          <div className="flex flex-row space-x-4 items-center border-b w-full justify-center">
            <img
              src={chrome.runtime.getURL("src/images/icon.png")}
              alt="logo"
              className="w-6 h-6"
            />
            <div className="my-2 text-xl font-bold py-4 border-gray-50 text-center">
              CryptoConvert
            </div>
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col items-center">
              <div className="text-xl font-semibold">Select currency</div>
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
            <div className="flex flex-col space-y-4">
              <div className="text-base font-semibold text-center">
                Price refresh interval (m)
              </div>
              <Slider
                min={1}
                value={interval}
                marks={{ 0: 1, 20: 5, 40: 7, 60: 8, 80: 10, 100: 15 }}
                onChange={onIntervalChange}
                step={null}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 py-4 w-full">
              <BuyMeCoffee />
              <ReportIssue />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
