import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Bumpkin } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import token from "assets/icons/token_2.png";
import chatTriangle from "assets/ui/panel/chat_triangle.png";

import { MachineInterpreter } from "../websocketMachine";
import { REACTIONS } from "../lib/reactions";
import { getKeys } from "features/game/types/craftables";
import { BumpkinDiscovery, ChatMessage, Player } from "../lib/types";
import { BumpkinFriend } from "./BumpkinFriend";
import { SelectBox } from "./SelectBox";
import { getDistance } from "../lib/coordinates";
import { pixelGrayBorderStyle } from "features/game/lib/style";

interface Props {
  messages: ChatMessage[];
  bumpkin: Bumpkin;
  websocketService: MachineInterpreter;
  discoveries: BumpkinDiscovery[];
  lastPosition: Coordinates;
  position: Coordinates;
  bumpkins: Player[];
  onVisit: (id: number) => void;
}

const Message: React.FC<ChatMessage> = ({ text, reaction }) => {
  if (text) {
    return (
      <>
        <div
          className={
            "absolute text-xs bg-white object-contain justify-center items-center flex px-1"
          }
          style={{
            ...pixelGrayBorderStyle,
            bottom: "34px",
            left: "0",
            textAlign: "start",
            color: "black",
            textShadow: "none",
            fontFamily: "monospace",
            fontWeight: "bold",
            right: "-200px",
            maxWidth: "120px",
            width: "fit-content",
            wordSpacing: "-1px",
          }}
        >
          <span>{text}</span>
        </div>

        <img
          src={chatTriangle}
          className="absolute"
          style={{
            bottom: "28.5px",
            left: "17px",
            width: "13px",
          }}
        />
      </>
    );
  }

  if (reaction) {
    return (
      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: `${PIXEL_SCALE * -4}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <img
          className="h-6"
          src={REACTIONS.find((r) => r.name === reaction)?.icon ?? ""}
        />
      </div>
    );
  }

  return null;
};

const Discovery: React.FC<BumpkinDiscovery> = ({ items, sfl }) => {
  if (sfl) {
    return (
      <div
        className="absolute flex items-center"
        style={{
          bottom: "29px",
          left: "8px",
          textAlign: "center",
        }}
      >
        <img src={token} className="h-8 img-highlight-heavy mr-2" />
        <span>{sfl}</span>
      </div>
    );
  }

  const names = getKeys(items);
  if (names.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute flex items-center"
      style={{
        bottom: "29px",
        left: "8px",
        textAlign: "center",
      }}
    >
      <span className="mr-2">+</span>
      <img
        src={ITEM_DETAILS[names[0]].image}
        className="h-8 img-highlight-heavy"
      />
    </div>
  );
};

// Pixel per MS
const WALKING_SPEED = 3;

export const Bumpkins: React.FC<Props> = ({
  messages,
  bumpkin,
  position,
  lastPosition,
  bumpkins,
  discoveries,
}) => {
  const [selectedBumpkin, setSelectedBumpkin] = useState<Player>();
  const freshMessages = messages;
  const myMessage = freshMessages.find((m) => m.bumpkinId === bumpkin.id);
  const myDiscovery = discoveries.find((m) => m.bumpkinId === bumpkin.id);

  return (
    <div className="z-20">
      <Modal
        show={!!selectedBumpkin}
        centered
        onHide={() => setSelectedBumpkin(undefined)}
      >
        {selectedBumpkin && (
          <BumpkinFriend
            accountId={selectedBumpkin.accountId}
            bumpkin={selectedBumpkin?.bumpkin as Bumpkin}
            onClose={() => setSelectedBumpkin(undefined)}
          />
        )}
      </Modal>

      <SelectBox position={position} />

      {bumpkin && (
        <div
          key={bumpkin.id}
          id="my-bumpkin"
          className="absolute z-30 transition-transform ease-linear pointer-events-none"
          style={{
            transform: `translate(${position?.x}px,${position?.y}px)`,
            height: `${GRID_WIDTH_PX}px`,
            width: `${GRID_WIDTH_PX}px`,
            left: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * -18}px`,
            // speed = distance ÷ time
            transitionDuration: `${
              Math.floor(getDistance(lastPosition, position)) * WALKING_SPEED
            }ms`,
          }}
        >
          {myMessage && <Message {...myMessage} />}
          {myDiscovery && <Discovery {...myDiscovery} />}

          <NPC {...bumpkin.equipped} />

          <div
            className="absolute text-center"
            style={{
              bottom: "-36px",
              width: "60px",
              left: "-9px",
              fontSize: "4px",
            }}
          >
            <span style={{ fontSize: "10px" }}>{`#${bumpkin.id}`}</span>
          </div>
        </div>
      )}

      {bumpkins
        .filter((b) => !!b.coordinates && !!b.bumpkin)
        .map((otherBumpkin) => {
          const message = freshMessages.find(
            (m) => m.bumpkinId === otherBumpkin.bumpkin.id
          );

          const discovery = discoveries.find(
            (d) => d.bumpkinId === otherBumpkin.bumpkin.id
          );

          return (
            <div
              key={otherBumpkin.bumpkin.id}
              className="absolute z-20 transition-transform ease-linear"
              style={{
                transform: `translate(${otherBumpkin.coordinates.x}px,${otherBumpkin.coordinates.y}px)`,
                height: `${GRID_WIDTH_PX}px`,
                width: `${GRID_WIDTH_PX}px`,
                left: "-27px",
                top: "-47px",
                // speed = distance ÷ time
                transitionDuration: `${
                  Math.floor(
                    getDistance(
                      otherBumpkin.oldCoordinates ?? otherBumpkin.coordinates,
                      otherBumpkin.coordinates
                    )
                  ) * WALKING_SPEED
                }ms`,
              }}
            >
              {message && <Message {...message} />}
              {discovery && <Discovery {...discovery} />}

              <NPC
                {...otherBumpkin.bumpkin.equipped}
                onClick={() => setSelectedBumpkin(otherBumpkin)}
              />
              <div
                className="absolute text-center"
                style={{
                  bottom: "-36px",
                  width: "60px",
                  left: "-9px",
                  fontSize: "4px",
                }}
              >
                <span
                  style={{ fontSize: "10px" }}
                >{`#${otherBumpkin.bumpkin.id}`}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};
