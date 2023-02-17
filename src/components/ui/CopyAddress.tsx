import React, { useState } from "react";

import { CopySvg } from "components/ui/CopyField";
import { shortAddress } from "lib/utils/shortAddress";

import { Label } from "components/ui/Label";
import clipboard from "clipboard";
import classNames from "classnames";

const TOOL_TIP_MESSAGE = "Copy Address";

export const CopyAddress: React.FC<{ address: string; showCopy?: boolean }> = ({
  address,
  showCopy = true,
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState(TOOL_TIP_MESSAGE);
  const [showLabel, setShowLabel] = useState(false);

  const copyToClipboard = () => {
    try {
      clipboard.copy(address);

      setShowLabel(true);
      setTooltipMessage("Copied!");
    } catch (e: unknown) {
      setShowLabel(true);
      setTooltipMessage(typeof e === "string" ? e : "Copy Failed!");
    }

    // Close tooltip after two seconds
    setTimeout(() => {
      setShowLabel(false);
      setTooltipMessage(TOOL_TIP_MESSAGE);
    }, 2000);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center w-full">
        <p
          className={classNames("cursor-pointer", {
            grow: showFullAddress,
          })}
          onClick={() => setShowFullAddress(!showFullAddress)}
        >
          {showFullAddress ? address : shortAddress(address)}
        </p>
        {showCopy && (
          <span
            className="cursor-pointer ml-2 flex-none"
            onMouseEnter={() => setShowLabel(true)}
            onMouseLeave={() => setShowLabel(false)}
            onClick={copyToClipboard}
          >
            <CopySvg height={14} />
          </span>
        )}
      </div>
      <div
        className={`absolute top-6 left-9 mr-5 transition duration-400 pointer-events-none ${
          showLabel ? "opacity-100" : "opacity-0"
        }`}
      >
        <Label type="success">{tooltipMessage}</Label>
      </div>
    </div>
  );
};
