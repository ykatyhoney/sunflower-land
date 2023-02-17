import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "../../../components/ui/Panel";
import { Equipped } from "features/game/types/bumpkin";
import { Tab } from "components/ui/Tab";
import { SquareIcon } from "components/ui/SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";

export interface PanelTabs {
  icon: string;
  name: string;
}

interface Props {
  tabs?: PanelTabs[];
  currentTab?: number;
  setCurrentTab?: React.Dispatch<React.SetStateAction<number>>;
  title?: string | JSX.Element;
  onClose?: () => void;
  onBack?: () => void;
  bumpkinParts?: Partial<Equipped>;
  className?: string;
}

/**
 * A custom panel built for the game.
 * @tabs The tabs of the panel.
 * @currentTab The current selected tab index of the panel. Default is 0.
 * @setCurrentTab Dispatch method to set the current selected tab index.
 * @title The panel title.
 * @onClose The close panel method.  Close button will show if this is set.
 * @onBack The back button method.  Back button will show if this is set.
 * @bumpkinParts The list of bumpkin parts for the modal.
 * @className Additional class name for the parent panel.
 * @children The panel children content.
 */
export const CloseButtonPanel: React.FC<Props> = ({
  tabs,
  currentTab = 0,
  setCurrentTab,
  title,
  onClose,
  onBack,
  bumpkinParts,
  className,
  children,
}) => {
  const handleTabClick = (index: number) => {
    setCurrentTab && setCurrentTab(index);
  };

  const showCloseButton = !!onClose;
  const showBackButton = !!onBack;

  return (
    <Panel
      className={classNames("relative", className)}
      bumpkinParts={bumpkinParts}
      hasTabs={!!tabs}
    >
      {/* Tabs */}
      {tabs && (
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => (
              <Tab
                key={`tab-${index}`}
                className="flex items-center"
                isActive={currentTab === index}
                onClick={() => handleTabClick(index)}
              >
                <SquareIcon icon={tab.icon} width={7} />
                <span className="text-xs sm:text-sm text-ellipsis ml-2">
                  {tab.name}
                </span>
              </Tab>
            ))}
          </div>
          <div className="grow" />
          {showCloseButton && (
            <img
              src={SUNNYSIDE.icons.close}
              className="flex-none cursor-pointer"
              onClick={onClose}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
                marginTop: `${PIXEL_SCALE * 1}px`,
                marginLeft: `${PIXEL_SCALE * 2}px`,
                marginRight: `${PIXEL_SCALE * 1}px`,
              }}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div>
        {title && (
          <div className="flex text-center">
            {(showCloseButton || showBackButton) && !tabs && (
              <div
                className="flex-none"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              >
                {showBackButton && (
                  <img
                    src={SUNNYSIDE.icons.arrow_left}
                    className="cursor-pointer"
                    onClick={onBack}
                    style={{
                      width: `${PIXEL_SCALE * 11}px`,
                    }}
                  />
                )}
              </div>
            )}
            <div className="grow mb-3 text-lg">{title}</div>
            {(showCloseButton || showBackButton) && !tabs && (
              <div className="flex-none">
                {showCloseButton && (
                  <img
                    src={SUNNYSIDE.icons.close}
                    className="cursor-pointer"
                    onClick={onClose}
                    style={{
                      width: `${PIXEL_SCALE * 11}px`,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}
        {/* Float button to right so that context text will wrap around it */}
        {showCloseButton && !tabs && !title && (
          <img
            src={SUNNYSIDE.icons.close}
            className="float-right cursor-pointer z-20 ml-3"
            onClick={onClose}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        )}
        {children}
      </div>
    </Panel>
  );
};
