import * as React from "react";
import { FixedSizeList as List } from "react-window";
import Icon from "./Icon";
import Modal from "./Modal";
import useCurrency from "@hooks/Currency";
import { getFlagSrc } from "@utils/flag";

interface CryptoInputProps {
  readonly?: boolean;
  value?: number | string;
  currencyValue?: string;
  onCurrencySelect?: (coin: string) => void;
  onInput?: (value: number) => void;
}

const CurrencyInput: React.FC<CryptoInputProps> = ({
  readonly = false,
  value = "",
  currencyValue,
  onCurrencySelect,
  onInput,
}) => {
  const { currencies } = useCurrency();

  const [selectedCurrency, setSelectedCurrency] = React.useState(
    currencyValue ?? "MYR"
  );
  const [search, setSearch] = React.useState<string>("");

  const [isDropdownOpened, setIsDropdownOpened] =
    React.useState<boolean>(false);

  const filteredCurrencies = React.useMemo(
    () =>
      search
        ? currencies.filter((currency) =>
            currency.toLowerCase().includes(search.toLowerCase())
          )
        : currencies,
    [search, currencies]
  );

  const toggleDropdown = React.useCallback(
    () => setIsDropdownOpened((prevState) => !prevState),
    []
  );

  const _onCurrencySelect = React.useCallback(
    (currency) => {
      setSelectedCurrency(currency);
      onCurrencySelect?.(currency);
      setIsDropdownOpened(false);
    },
    [onCurrencySelect]
  );

  // const _onInput = React.useCallback(
  //   (e) => {
  //     onInput?.(e.target.value);
  //   },
  //   [onInput]
  // );

  const onSearch = React.useCallback((evt) => setSearch(evt.target.value), []);

  React.useEffect(() => {
    setSelectedCurrency(currencyValue ?? "MYR");
  }, [currencyValue]);

  return (
    <>
      <div className="p-4 flex flex-row space-x-4 justify-between rounded-lg">
        <div
          className="flex flex-row space-x-2 items-center justify-center rounded-lg px-4 py-2 border border-white hover:border-yellow-400 shadow-white cursor-pointer"
          onClick={toggleDropdown}
        >
          <img src={getFlagSrc(selectedCurrency)} className="w-5 h-3" />
          <div className="text-base font-medium mr-2">
            {selectedCurrency.toUpperCase()}
          </div>
          <div className="w-4 h-4 flex justify-center items-center">
            <Icon name="chevronDown" size={12} color="white" />
          </div>
        </div>
        {/* <input
          disabled={readonly}
          className="text-lg font-bold bg-transparent text-white focus:outline-none appearance-none"
          style={{
            direction: "rtl",
          }}
          type="number"
          placeholder="0.00"
          value={value}
          onChange={_onInput}
        /> */}
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
          itemData={filteredCurrencies}
          itemCount={filteredCurrencies.length}
          itemSize={80}
          height={400 - 92} // 92 - search bar height
          width={384}
        >
          {({ data, index, style }) => (
            <div
              className="text-base font-semibold bg-gray-800 px-4 flex justify-center items-center w-full"
              style={style}
              onClick={() => _onCurrencySelect(data[index])}
            >
              <div className="flex flex-row space-x-4 items-center rounded-lg bg-black w-full text-white p-6 whitespace-nowrap truncate cursor-pointer hover:shadow-md">
                <img src={getFlagSrc(data[index])} className="w-5 h-3" />
                <span className="text-base font-medium">
                  {data[index].toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </List>
      </Modal>
    </>
  );
};

export default React.memo(CurrencyInput);
