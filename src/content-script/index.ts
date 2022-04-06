import { MESSAGE_EVENTS } from "@constants/events";
import throttle from "lodash.throttle";

document.onreadystatechange = () => {
  const tooltipLink = document.createElement("link");
  tooltipLink.rel = "stylesheet";
  tooltipLink.href =
    "https://cdn.jsdelivr.net/npm/cooltipz-css@2.1.0/cooltipz.min.css";

  document.head.appendChild(tooltipLink);

  chrome.runtime.onMessage.addListener(async (request) => {
    if (request.type === MESSAGE_EVENTS.SET_CURRENCY) {
      await chrome.storage.local.set({ currency: request.payload.currency });
      updateCurrency();
    }
  });
};

document.addEventListener(
  "DOMSubtreeModified",
  throttle(() => {
    updateCurrency();
  }, 2500)
);

const addTooltip = (selectedDOM: Element, content: string) => {
  selectedDOM.classList.add("cooltipz--top");
  selectedDOM?.setAttribute("aria-label", content);
};

const isInvalidNumber = (value: string | null | undefined) => {
  return !value || !/^\d+\.\d+$/.test(value);
};

const updateCurrency = async () => {
  const local = await chrome.storage.local.get("currency");
  const currency = local?.currency ?? "USD";
  chrome.runtime.sendMessage(
    { type: MESSAGE_EVENTS.GET_MARKETS, payload: { currency } },
    ({ markets }) => {
      markets.forEach((market: any) => {
        const snapShot = document.evaluate(
          `//*[contains(text(),"${market.symbol.toUpperCase()}")]`,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
        );

        [...new Array(snapShot.snapshotLength).keys()].forEach((idx) => {
          let snapShotDOM = snapShot.snapshotItem(idx) as Element;
          const previousDOM = snapShotDOM.previousElementSibling;

          let amount: string | null | undefined =
            snapShotDOM.textContent?.split(" ")?.[0];

          if (isInvalidNumber(amount)) {
            amount = previousDOM?.textContent;
            snapShotDOM = previousDOM ?? snapShotDOM;
          }

          if (isInvalidNumber(amount)) {
            amount = previousDOM?.firstElementChild?.textContent;
          }

          if (!isInvalidNumber(amount))
            addTooltip(
              snapShotDOM,
              `${(market.current_price * +(amount ?? 0)).toFixed(
                2
              )} ${currency}`
            );
        });
      });
    }
  );
};
