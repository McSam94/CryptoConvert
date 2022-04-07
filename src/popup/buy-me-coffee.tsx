import Icon from "@components/Icon";
import Modal from "@components/Modal";
import ClipboardJS from "clipboard";
import * as React from "react";

const MY_BITCOIN_ADDRESS = "3KyoZqCVwjbzBXZWuRfyc1giQjx7kTj4bg";

const BuyMeCoffee: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  const toggleModal = React.useCallback(
    () => setIsModalOpen((prevState) => !prevState),
    []
  );

  React.useEffect(() => {
    const clipboard = new ClipboardJS("#copy");

    clipboard.on("success", () => {
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 1500);
    });

    return () => clipboard.destroy();
  }, []);

  return (
    <>
      <div className="flex flex-col space-y-4 ">
        <div className="text-xs font-semibold">
          If you like my work, consider buy me a coffee/bitcoin
        </div>
        <div className="flex flex-row space-x-2 items-center w-full">
          <a href="https://buymeacoffee.com/oh8yMYq" target="_blank">
            <img
              className="h-10 cursor-pointer"
              src={chrome.runtime.getURL("src/images/bmc-button.png")}
              alt="bmc"
            />
          </a>
          <div
            className="flex flex-row items-center space-x-2 bg-white rounded-lg p-2 cursor-pointer"
            onClick={toggleModal}
          >
            <Icon name="bitcoin" size={24} />
            <div className="text-sm text-black">Buy me bitcoin</div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} toggleModal={toggleModal}>
        <div className="flex flex-col space-y-4 p-6 items-center justify-center h-full">
          <div className="bg-white p-4">
            <img
              src={chrome.runtime.getURL("src/images/bitcoin-qr.png")}
              className="w-32 h-32"
              alt="bitcoin"
            />
          </div>
          <div className="flex flex-row space-x-1 items-center bg-black p-2 rounded-lg">
            <div
              id="bitcoin-address"
              className="text-sm whitespace-nowrap truncate text-white"
            >
              {MY_BITCOIN_ADDRESS}
            </div>
            <Icon
              id="copy"
              name={isCopied ? "check" : "clipboard"}
              className="cursor-pointer"
              size={16}
              color={isCopied ? "green" : "white"}
              data-clipboard-target="#bitcoin-address"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BuyMeCoffee;
