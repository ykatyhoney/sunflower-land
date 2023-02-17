import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useContext, useLayoutEffect, useState } from "react";

import background from "assets/land/helios.webp";
import { GrubShop } from "./components/grubShop/GrubShop";
import { Decorations } from "./components/decorations/Decorations";
import { Potions } from "./components/potions/Potions";
import { ExoticShop } from "./components/exoticShop/ExoticShop";
import { HeliosSunflower } from "./components/HeliosSunflower";
import { HeliosBlacksmith } from "./components/blacksmith/HeliosBlacksmith";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { LostSunflorian } from "./components/npcs/LostSunflorian";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { RustyShovelSeller } from "./components/rustyShovelSeller/RustyShovelSeller";
import { CommunityGardenEntry } from "./components/CommunityGardenEntry";

// random seal spawn spots
import { randomInt } from "lib/utils/random";
import { LostSeal } from "features/community/seal/Seal";
import { Hud } from "features/island/hud/Hud";

const spawn = [
  [30, 15],
  [10, 15],
  [10, 25],
  [35, 25],
];

const getRandomSpawn = () => {
  const randomSpawn = randomInt(0, 4);
  return spawn[randomSpawn];
};

export const Helios: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;
  const { bumpkin } = state;
  const [sealSpawn] = useState(getRandomSpawn());

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.HeliosBackGround, "auto");
  }, []);

  // Load data
  return (
    <>
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
          id={Section.HeliosBackGround}
        />
        <Decorations />
        <GrubShop />
        <HeliosBlacksmith inventory={gameState.context.state.inventory} />
        <Potions />
        <ExoticShop />
        <HeliosSunflower />
        <LostSunflorian />
        <RustyShovelSeller />
        <CommunityGardenEntry />
        <LostSeal left={sealSpawn[0]} top={sealSpawn[1]} />

        <IslandTravel
          bumpkin={bumpkin}
          inventory={gameState.context.state.inventory}
          x={3.5}
          y={-17}
          onTravelDialogOpened={() => gameService.send("SAVE")}
          travelAllowed={!gameState.matches("autosaving")}
        />
      </div>
      <Hud isFarming={false} />
    </>
  );
};
