import { MESSAGE_EVENTS } from "@constants/events";
import { log, groupLog } from "@utils/log";
import { throttle } from "@utils/throttle";

let timer: NodeJS.Timer;

document.onreadystatechange = () => {
  const tooltipLink = document.createElement("link");
  tooltipLink.rel = "stylesheet";
  tooltipLink.href =
    "https://cdn.jsdelivr.net/npm/cooltipz-css@2.1.0/cooltipz.min.css";

  document.head.appendChild(tooltipLink);

  chrome.storage.onChanged.addListener(function (changes) {
    for (const [_, { oldValue, newValue }] of Object.entries(changes)) {
      if (newValue !== oldValue) startTimer();
    }
  });

  startTimer();
};

document.addEventListener("DOMSubtreeModified", () => startTimer());

const addTooltip = (selectedDOM: Element, content: string) => {
  selectedDOM.classList.add("cooltipz--top");
  selectedDOM?.setAttribute("aria-label", content);
};

const isInvalidNumber = (value: string | null | undefined) => {
  return !value || !/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(value);
};

const startTimer = throttle(async () => {
  if (timer) {
    clearInterval(timer);
    log(`Previous timer cleared`);
  }

  const local = await chrome.storage.local.get(["interval", "isOff"]);
  if (local?.isOff) return;
  const interval = local?.interval ?? 1;

  log(`New Interval started`);
  timer = setInterval(() => updateCurrency(), +interval * 60000); // convert min to ms
  updateCurrency();
}, 3500);

const updateCurrency = async () => {
  const local = await chrome.storage.local.get("currency");
  const currency = local?.currency ?? "USD";
  chrome.runtime.sendMessage(
    { type: MESSAGE_EVENTS.GET_MARKETS, payload: { currency } },
    ({ markets }) => {
      document.body.normalize();
      groupLog("Web scrapping...");
      markets.forEach((market: any) => {
        log(`Searching for ${market.symbol} in the web...`);
        const snapShot = document.evaluate(
          `//*[contains(text(),"${market.symbol.toUpperCase()}")]`,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );

        [...new Array(snapShot.snapshotLength).keys()].forEach((idx) => {
          let snapShotDOM = snapShot.snapshotItem(idx) as Element;
          const previousDOM = snapShotDOM.previousElementSibling;

          let amount: string | null | undefined = snapShotDOM.textContent
            ?.split(" ")?.[0]
            ?.replaceAll(",", "");

          if (isInvalidNumber(amount)) {
            amount = previousDOM?.textContent?.replaceAll(",", "");
            snapShotDOM = previousDOM ?? snapShotDOM;
          }

          if (isInvalidNumber(amount)) {
            amount = previousDOM?.firstElementChild?.textContent?.replaceAll(
              ",",
              ""
            );
          }

          if (!isInvalidNumber(amount)) {
            log(`Cryptocurrency found: ${amount} ${market.symbol}`);
            addTooltip(
              snapShotDOM,
              `${(market.current_price * +(amount ?? 0)).toFixed(
                2
              )} ${currency}`
            );
          }
        });
      });
      groupLog("", true);
    }
  );
};
