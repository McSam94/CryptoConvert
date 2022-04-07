import * as React from "react";
import { FixedSizeList as List } from "react-window";
import useCoinGecko from "@hooks/CoinGecko";
import Icon from "./Icon";
import Modal from "./Modal";
import { Market } from "@provider/CoinGecko";

interface CryptoInputProps {
  readonly?: boolean;
  value?: number | string;
  coinValue?: Market | null;
  onCoinSelect?: (coin: Market) => void;
  onInput?: (value: number) => void;
}

const CoinInput: React.FC<CryptoInputProps> = ({
  readonly = false,
  value = "",
  coinValue,
  onCoinSelect,
  onInput,
}) => {
  const { markets, isFetchingMarkets } = useCoinGecko();

  const [selectedCoin, setSelectedCoin] = React.useState<Market | null>(
    coinValue ?? markets?.[0] ?? null
  );
  const [search, setSearch] = React.useState<string>("");

  const [isDropdownOpened, setIsDropdownOpened] =
    React.useState<boolean>(false);

  const filteredMarkets = React.useMemo(
    () =>
      search
        ? markets.filter(
            (markets) =>
              markets.name.toLowerCase().includes(search.toLowerCase()) ||
              markets.symbol.toLowerCase().includes(search.toLowerCase())
          )
        : markets,
    [search, markets]
  );

  const toggleDropdown = React.useCallback(
    () => setIsDropdownOpened((prevState) => !prevState),
    []
  );

  const _onCoinSelect = React.useCallback(
    (coinInfo) => {
      setSelectedCoin(coinInfo);
      onCoinSelect?.(coinInfo);
      setIsDropdownOpened(false);
    },
    [onCoinSelect]
  );

  const _onInput = React.useCallback(
    (e) => {
      onInput?.(e.target.value);
    },
    [onInput]
  );

  const onSearch = React.useCallback((evt) => setSearch(evt.target.value), []);

  React.useEffect(() => {
    setSelectedCoin(coinValue ?? markets?.[0] ?? null);
  }, [coinValue]);

  return (
    <>
      <div className="p-4 flex flex-row space-x-4 justify-between rounded-lg bg-gray-100/50">
        {isFetchingMarkets ? (
          <div className="h-10 w-24 animate-pulse bg-gray-200 rounded-lg" />
        ) : (
          <div
            className="flex flex-row space-x-2 items-center justify-center rounded-lg px-4 py-2 hover:shadow-md cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              src={selectedCoin?.image}
              alt={selectedCoin?.symbol}
              className="w-5 h-5"
            />
            <div className="text-base font-medium">
              {selectedCoin?.symbol.toUpperCase()}
            </div>
            <div className="w-4 h-4">
              <Icon
                name="chevronDown"
                size={16}
                colorFn={({ hover }) => (hover ? "black" : "white")}
              />
            </div>
          </div>
        )}
        <input
          disabled={readonly}
          className="text-lg font-bold bg-transparent text-white focus:outline-none appearance-none"
          style={{
            direction: "rtl",
          }}
          type="number"
          placeholder="0.00"
          onChange={_onInput}
          value={value}
        />
      </div>
      <Modal isOpen={isDropdownOpened} toggleModal={toggleDropdown}>
        <div className="flex p-4">
          <input
            className="text-lg bg-gray-700 focus:outline-none appearance-none w-full px-6 py-4 rounded-lg"
            type="text"
            placeholder="🔍 Search"
            onChange={onSearch}
          />
        </div>
        <List
          useIsScrolling
          itemData={filteredMarkets}
          itemCount={filteredMarkets.length}
          itemSize={80}
          height={400 - 92} // 92 - search bar height
          width={410}
        >
          {({ data, index, style }) => (
            <div
              className="text-base font-semibold bg-gray-800 px-6 justify-center items-center w-full"
              style={style}
              onClick={() => _onCoinSelect(data[index])}
            >
              <div className="flex flex-row space-x-4 items-center rounded-lg bg-black text-white p-6 whitespace-nowrap truncate cursor-pointer hover:shadow-md">
                <img
                  src={data[index].image}
                  alt={data[index].symbol}
                  className="w-6 h-6"
                />
                <span className="text-base font-medium">
                  {data[index].symbol.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </List>
      </Modal>
    </>
  );
};

export default React.memo(CoinInput);
