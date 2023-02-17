import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import ScrollContainer from "react-indiana-drag-scroll";
import ocean from "assets/decorations/ocean.webp";
import background from "assets/land/retreat.webp";
import { ToastProvider } from "features/game/toast/ToastQueueProvider";
import { RetreatBank } from "./components/bank/RetreatBank";
import { RetreatStorageHouse } from "./components/storageHouse/RetreatStorageHouse";
import { RetreatHotAirBalloon } from "./components/hotAirBalloon/RetreatHotAirBalloon";
import { RetreatTailor } from "./components/tailor/RetreatTailor";
import { RetreatBlacksmith } from "./components/blacksmith/RetreatBlacksmith";
import { Auctioneer } from "./components/auctioneer/Auctioneer";
import { Resale } from "./components/resale/Resale";
import { RetreatWishingWell } from "./components/wishingWell/RetreatWishingWell";
import { IslandTravelWrapper } from "./components/islandTravel/IslandTravelWrapper";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Loading, Splash } from "features/auth/components";
import { Forbidden } from "features/auth/components/Forbidden";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { ErrorCode } from "lib/errors";
import {
  RETREAT_LEVEL_REQUIREMENT,
  StateValues,
} from "features/game/lib/goblinMachine";
import { Withdrawing } from "features/game/components/Withdrawing";
import { Withdrawn } from "features/game/components/Withdrawn";
import { getBumpkinLevel } from "features/game/lib/level";
// random seal spawn spots
import { randomInt } from "lib/utils/random";
import { LostSeal } from "features/community/seal/Seal";

import { Hud } from "./Hud";
import { Minting } from "features/game/components/Minting";
import { Minted } from "features/game/components/Minted";
import { Refreshing } from "features/auth/components/Refreshing";

const spawn = [
  [35, 15],
  [10, 15],
  [10, 25],
  [35, 25],
  [21, 19],
];

const getRandomSpawn = () => {
  const randomSpawn = randomInt(0, 5);
  return spawn[randomSpawn];
};

const SHOW_MODAL: Partial<Record<StateValues, boolean>> = {
  loading: true,
  minting: true,
  minted: true,
  withdrawing: true,
  withdrawn: true,
  playing: false,
  error: true,
  depositing: true,
  refreshing: true,
};

export const Game = () => {
  const container = useRef(null);
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [scrollIntoView] = useScrollIntoView();
  const [retreatLoaded, setRetreatLoaded] = useState(false);
  const [sealSpawn, setSealSpawn] = useState(getRandomSpawn());

  useLayoutEffect(() => {
    if (retreatLoaded) {
      scrollIntoView(Section.RetreatBackground, "auto");
    }
  }, [retreatLoaded]);

  const { bumpkin } = goblinState.context.state;

  const hasRequiredLevel =
    bumpkin && getBumpkinLevel(bumpkin.experience) >= RETREAT_LEVEL_REQUIREMENT;

  return (
    <>
      <Modal
        show={SHOW_MODAL[goblinState.value as StateValues]}
        centered
        backdrop={retreatLoaded}
      >
        <Panel className="text-shadow">
          {goblinState.matches("error") && (
            <ErrorMessage
              errorCode={goblinState.context.errorCode as ErrorCode}
            />
          )}
          {goblinState.matches("withdrawing") && <Withdrawing />}
          {goblinState.matches("loading") && <Loading />}
          {goblinState.matches("withdrawn") && <Withdrawn />}
          {goblinState.matches("minting") && <Minting />}
          {goblinState.matches("minted") && <Minted />}
          {goblinState.matches("depositing") && <Loading text="Depositing" />}
          {goblinState.matches("refreshing") && <Refreshing />}
        </Panel>
      </Modal>
      <ToastProvider>
        <ScrollContainer
          className="bg-blue-300 overflow-scroll relative w-full h-full"
          innerRef={container}
        >
          <div
            className="relative"
            style={{
              width: `${84 * GRID_WIDTH_PX}px`,
              height: `${56 * GRID_WIDTH_PX}px`,
            }}
          >
            <div
              className="absolute inset-0 bg-repeat w-full h-full"
              style={{
                backgroundImage: `url(${ocean})`,
                backgroundSize: `${64 * PIXEL_SCALE}px`,
                imageRendering: "pixelated",
              }}
            />
            {hasRequiredLevel && !!bumpkin && (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: `${40 * GRID_WIDTH_PX}px`,
                  height: `${40 * GRID_WIDTH_PX}px`,
                }}
              >
                <img
                  src={background}
                  className="absolute inset-0 w-full h-full"
                  id={Section.RetreatBackground}
                  onLoad={() => setRetreatLoaded(true)}
                />
                <RetreatBank />
                <RetreatStorageHouse />
                <RetreatHotAirBalloon />
                <RetreatTailor />
                <RetreatBlacksmith
                  inventory={goblinState.context.state.inventory}
                />
                <Auctioneer />
                <Resale />
                <RetreatWishingWell />
                <IslandTravelWrapper />
                <LostSeal left={sealSpawn[0]} top={sealSpawn[1]} />
              </div>
            )}
            {!hasRequiredLevel && !goblinState.matches("loading") && (
              <Splash>
                <Forbidden />
              </Splash>
            )}
          </div>
        </ScrollContainer>
      </ToastProvider>
      <div className="absolute z-20">
        <Hud />
      </div>
    </>
  );
};
