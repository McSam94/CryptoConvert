import * as React from "react";
import classnames from "classnames";
import Icon from "./Icon";

interface ToggleProps {
  className?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  className,
  value = false,
  onChange,
}) => {
  const [isOff, setIsOff] = React.useState<boolean>(value);

  const onToggle = React.useCallback(() => {
    setIsOff((prevState) => {
      const nextState = !prevState;
      onChange?.(nextState);
      return nextState;
    });
  }, []);

  React.useEffect(() => {
    setIsOff(value);
  }, [value]);

  return (
    <div
      className={classnames(
        "flex flex-row w-11 h-5 items-center rounded-3xl relative",
        {
          "bg-green-400": !isOff,
          "bg-red-400": isOff,
        },
        className
      )}
    >
      <div
        className={classnames(
          "w-10 h-10 absolute flex justify-center items-center rounded-full border-0 hover:shadow-md hover:shadow-gray-500 cursor-pointer bg-white transition-transform",
          {
            "-translate-x-1/2": isOff,
            "translate-x-1/2 right-0": !isOff,
          }
        )}
        onClick={onToggle}
      >
        <Icon name="power" size={16} color={isOff ? "red" : "green"} />
      </div>
    </div>
  );
};

export default React.memo(Toggle);
