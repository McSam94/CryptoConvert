import { MESSAGE_EVENTS } from "@constants/events";

const COINGECKO_BASE_URI = "https://api.coingecko.com/api/v3";

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (!request?.type) throw new Error("No message type found");

  if (request.type === MESSAGE_EVENTS.GET_MARKETS) {
    fetch(
      `${COINGECKO_BASE_URI}/coins/markets?vs_currency=${
        request?.payload?.currency ?? "USD"
      }`
    )
      .then((res) => res.json())
      .then((res) => sendResponse({ markets: res }));
  }

  if (request.type === MESSAGE_EVENTS.GET_CURRENCY) {
    fetch("https://www.currency-api.com/symbols")
      .then((res) => res.json())
      .then((res) => sendResponse({ currencies: res.symbols }));
  }

  return true;
});
