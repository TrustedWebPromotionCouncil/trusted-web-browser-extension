import React, {
  HTMLAttributes,
  FunctionComponent,
  useRef,
  useState,
} from "react";
import { Overlay, Tooltip } from "react-bootstrap";

import { Button } from "../button/Button";

interface CopyButtonProps extends HTMLAttributes<HTMLElement> {
  value: string;
}

export const CopyButton: FunctionComponent<CopyButtonProps> = ({
  value,
  children,
}) => {
  const target = useRef(null);
  const [showToolTip, setShowToolTip] = useState(false);

  const hideToolTip = () => setTimeout(() => setShowToolTip(false), 1000);

  const handleClick = () => {
    navigator.clipboard.writeText(value);
    setShowToolTip(true);
  };

  return (
    <>
      <span
        ref={target}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button buttonType={"outlined"} onClick={handleClick}>
          {children}
        </Button>
      </span>
      <Overlay
        target={target.current}
        show={showToolTip}
        placement="bottom"
        onEntered={() => hideToolTip()}
      >
        {(props) => (
          <Tooltip id="tooltip" {...props}>
            Copied!
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};
