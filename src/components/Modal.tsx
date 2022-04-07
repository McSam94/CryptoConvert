import * as React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import Icon from "./Icon";

interface ModalProps {
  isOpen: boolean;
  toggleModal?: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, toggleModal, children }) => {
  const modalRootRef = React.useRef<HTMLElement>(
    document.getElementById("modal")
  );
  const portalRef = React.useRef<HTMLDivElement>(document.createElement("div"));

  const closeModal = React.useCallback(() => toggleModal?.(), [toggleModal]);

  React.useEffect(() => {
    const portalClasses =
      "fixed top-0 left-0 z-10 h-screen w-screen bg-white transition-opacity";

    portalClasses.split(" ").forEach((_class) => {
      portalRef.current.classList.add(_class);
    });

    modalRootRef.current?.appendChild(portalRef.current);

    return () => {
      modalRootRef.current?.removeChild(portalRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      portalRef.current.classList.add("block");
      portalRef.current.classList.remove("hidden");
    } else {
      portalRef.current.classList.add("hidden");
      portalRef.current.classList.remove("block");
    }
  }, [isOpen]);

  return ReactDOM.createPortal(
    <div className="flex flex-col bg-gray-800 text-white">
      <div className="h-[calc(100vh-5rem)] relative overflow-y-auto">
        {children}
      </div>
      <div className="fixed bottom-0 w-full h-[5rem] flex flex-col px-6 justify-center shadow-inner bg-gray-800">
        <div
          className="bg-gray-900 text-white hover:shadow-md py-4 rounded-lg text-center text-base font-medium cursor-pointer"
          onClick={closeModal}
        >
          Close
        </div>
      </div>
    </div>,
    portalRef.current
  );
};

export default React.memo(Modal);
