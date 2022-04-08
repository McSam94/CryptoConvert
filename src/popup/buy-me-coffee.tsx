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
      <div className="flex flex-col space-y-4">
        <div className="text-xs font-semibold text-center">
          If you like my work, consider tip me
        </div>
        <div className="flex flex-row space-x-2 items-center w-full">
          <div className="flex flex-row space-x-2 items-center justify-center bg-[#FF424D] rounded-lg p-2 cursor-pointer">
            <Icon name="patreon" />
            <a
              href="https://www.patreon.com/bePatron?u=138989"
              target="_blank"
              data-patreon-widget-type="become-patron-button"
            >
              Support me
            </a>
          </div>
          <div
            className="flex flex-row items-center space-x-2 bg-white rounded-lg p-2 cursor-pointer"
            onClick={toggleModal}
          >
            <Icon name="bitcoin" />
            <div className="text-xs text-black">Buy me Bitcoin</div>
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
