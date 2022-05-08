import * as React from "react";
import Slider from "rc-slider";
import CurrencyInput from "@components/CurrencyInput";
import { MESSAGE_EVENTS } from "@constants/events";
import { log } from "@utils/log";
import Toggle from "@components/Toggle";
import ReportIssue from "./report-issue";
import BuyMeCoffee from "./buy-me-coffee";
import { INTERVAL } from "@constants/interval";

function App() {
  const [isOff, setIsOff] = React.useState<boolean>(false);
  const [currency, setCurrency] = React.useState<string>("USD");
  const [interval, setInterval] = React.useState<number>(1);

  const retrieveCurrency = React.useCallback(async () => {
    const local = await chrome.storage.local.get("currency");
    if (!local) return;

    log(`Successfully retrieved currency: ${local?.currency}`);
    setCurrency(local?.currency ?? "USD");
  }, []);

  const retrieveInterval = React.useCallback(async () => {
    const local = await chrome.storage.local.get("interval");
    if (!local) return;

    log(`Successfully retrieved interval: ${local?.interval}`);
    setInterval(
      +(
        Object.entries(INTERVAL).find(
          ([_, value]) => value === local?.interval
        )?.[0] ?? 0
      )
    );
  }, []);

  const retrieveOnOff = React.useCallback(async () => {
    const local = await chrome.storage.local.get("isOff");
    if (!local) return;

    log(`Successfully retrieved power: ${local?.isOff}`);
    setIsOff(local?.isOff ?? false);
  }, []);

  const onIntervalChange = React.useCallback(async (val) => {
    setInterval(val);
  }, []);

  React.useEffect(() => {
    chrome.runtime.sendMessage({
      type: MESSAGE_EVENTS.SET_ON_OFF,
      payload: { isOff },
    });
  }, [isOff]);

  React.useEffect(() => {
    chrome.runtime.sendMessage({
      type: MESSAGE_EVENTS.SET_CURRENCY,
      payload: { currency },
    });
  }, [currency]);

  React.useEffect(() => {
    chrome.runtime.sendMessage({
      type: MESSAGE_EVENTS.SET_INTERVAL,
      payload: { interval: INTERVAL[interval] },
    });
  }, [interval]);

  React.useEffect(() => {
    retrieveOnOff();
    retrieveCurrency();
    retrieveInterval();
  }, []);

  return (
    <>
      <div className="min-w-[24rem] min-h-[32rem] bg-gray-800 text-white px-6">
        <div className="flex flex-col h-screen items-center space-y-8">
          <div className="flex flex-col space-y-4 border-b border-gray-200 w-full items-center py-10">
            <div className="flex flex-row space-x-4 items-center justify-center">
              <img
                src={chrome.runtime.getURL("src/images/icon.png")}
                alt="logo"
                className="w-6 h-6"
              />
              <div className="my-2 text-xl font-bold border-gray-50 text-center">
                Crypto Convert
              </div>
            </div>
            <Toggle value={isOff} onChange={setIsOff} />
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <div className="flex flex-col items-center">
              <div className="text-sm font-semibold">Select currency</div>
              <CurrencyInput value={currency} onSelect={setCurrency} />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="text-sm font-semibold text-center">
                Price update interval (minute)
              </div>
              <div className="px-10">
                <Slider
                  min={1}
                  value={interval}
                  marks={INTERVAL}
                  onChange={onIntervalChange}
                  step={null}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4 py-6 w-full">
            <BuyMeCoffee />
            <ReportIssue />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
