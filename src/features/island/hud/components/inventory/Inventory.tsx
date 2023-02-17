import React, { useState } from "react";
import { Box } from "components/ui/Box";
import { InventoryItemsModal } from "./InventoryItemsModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getShortcuts } from "features/farming/hud/lib/shortcuts";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { getChestItems } from "./utils/inventory";
import { KNOWN_IDS } from "features/game/types";
import { useLocation } from "react-router-dom";

interface Props {
  state: GameState;
  selectedItem: InventoryItemName;
  shortcutItem?: (item: InventoryItemName) => void;
  onPlace?: (item: InventoryItemName) => void;
  onDepositClick?: () => void;
  isFarming: boolean;
  isSaving?: boolean;
}

export const Inventory: React.FC<Props> = ({
  state,
  selectedItem: selectedBasketItem,
  shortcutItem,
  isFarming,
  isSaving,
  onPlace,
  onDepositClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  // The actions included in this more buttons should not be shown if the player is in goblin retreat or visiting another farm
  const limitedInventory =
    pathname.includes("retreat") || pathname.includes("visit");

  const [selectedChestItem, setSelectedChestItem] = useState<InventoryItemName>(
    getKeys(getChestItems(state)).sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b])[0]
  );

  const shortcuts = getShortcuts();

  const handleBasketItemClick = (item: InventoryItemName) => {
    if (!shortcutItem) return;

    shortcutItem(item);
  };

  return (
    <>
      <div
        className="flex flex-col items-center fixed z-50"
        style={{
          right: `${PIXEL_SCALE * 3}px`,
          top: `${PIXEL_SCALE * 38}px`,
        }}
      >
        <div
          onClick={() => setIsOpen(true)}
          className="relative flex z-50 cursor-pointer hover:img-highlight"
          style={{
            marginLeft: `${PIXEL_SCALE * 2}px`,
            marginBottom: `${PIXEL_SCALE * 25}px`,
            width: `${PIXEL_SCALE * 22}px`,
          }}
        >
          <img
            src={SUNNYSIDE.ui.round_button}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
          <img
            src={SUNNYSIDE.icons.basket}
            className="absolute"
            style={{
              top: `${PIXEL_SCALE * 5}px`,
              left: `${PIXEL_SCALE * 5}px`,
              width: `${PIXEL_SCALE * 12}px`,
            }}
          />
        </div>

        {!limitedInventory && (
          <div
            className="flex flex-col items-center"
            style={{
              marginRight: `${PIXEL_SCALE * -3}px`,
            }}
          >
            {shortcuts.map((item, index) => (
              <Box
                key={index}
                isSelected={index === 0}
                image={ITEM_DETAILS[item]?.image}
                secondaryImage={ITEM_DETAILS[item]?.secondaryImage}
                count={state.inventory[item]?.sub(
                  state.collectibles[item as CollectibleName]?.length ?? 0
                )}
                onClick={() => handleBasketItemClick(item)}
              />
            ))}
          </div>
        )}
      </div>

      <InventoryItemsModal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        state={state}
        selectedBasketItem={selectedBasketItem}
        onSelectBasketItem={handleBasketItemClick}
        selectedChestItem={selectedChestItem}
        onSelectChestItem={setSelectedChestItem}
        onPlace={onPlace}
        onDepositClick={onDepositClick}
        isSaving={isSaving}
        isFarming={isFarming}
      />
    </>
  );
};
