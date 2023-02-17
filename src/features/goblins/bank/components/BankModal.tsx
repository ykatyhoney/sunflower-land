import React, { useContext, useState } from "react";

import token from "assets/icons/token_2.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { Withdraw } from "./Withdraw";
import { Deposit } from "./Deposit";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GoblinProvider";
import { DepositArgs } from "lib/blockchain/Deposit";

interface Props {
  farmAddress: string;
  onClose: () => void;
}

export const BankModal: React.FC<Props> = ({ onClose, farmAddress }) => {
  const { goblinService } = useContext(Context);
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    goblinService.send("DEPOSIT", args);
  };

  return (
    <Panel className="relative" hasTabs>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive={tab === "deposit"} onClick={() => setTab("deposit")}>
          <img src={token} className="h-5 mr-2" />
          <span className="text-sm">Deposit</span>
        </Tab>
        <Tab isActive={tab === "withdraw"} onClick={() => setTab("withdraw")}>
          <img src={token} className="h-5 mr-2" />
          <span className="text-sm">Withdraw</span>
        </Tab>
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>
      {tab === "deposit" && (
        <div className="mt-3">
          <Deposit
            farmAddress={farmAddress}
            onDeposit={handleDeposit}
            onClose={onClose}
          />
        </div>
      )}
      {tab === "withdraw" && <Withdraw onClose={onClose} />}
    </Panel>
  );
};
