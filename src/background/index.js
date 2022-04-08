import { MESSAGE_EVENTS } from "@constants/events";
import { log } from "@utils/log";

const COINGECKO_BASE_URI = "https://api.coingecko.com/api/v3";

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (!request?.type) throw new Error("No message type found");

  if (request.type === MESSAGE_EVENTS.GET_MARKETS) {
    const currency = request?.payload?.currency;
    log(`Fetching markets from currency ${currency}`);
    fetch(
      `${COINGECKO_BASE_URI}/coins/markets?vs_currency=${currency ?? "USD"}`
    )
      .then((res) => res.json())
      .then((res) => sendResponse({ markets: res }));
  }

  if (request.type === MESSAGE_EVENTS.SET_CURRENCY) {
    const currency = request?.payload?.currency;
    if (!currency) return false;

    log(`Successfully Persisted currency: ${currency}`);
    chrome.storage.local.set({ currency });
  }

  if (request.type === MESSAGE_EVENTS.SET_INTERVAL) {
    const interval = request?.payload?.interval;
    if (!interval) return false;

    log(`Successfully persisted interval: ${interval}`);
    chrome.storage.local.set({ interval });
  }

  return true;
});
