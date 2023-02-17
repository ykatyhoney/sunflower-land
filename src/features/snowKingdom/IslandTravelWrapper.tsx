import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";

export const IslandTravelWrapper = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;
  const { bumpkin } = state;

  return (
    <IslandTravel
      inventory={gameState.context.state.inventory}
      bumpkin={bumpkin}
      x={-2}
      y={-14}
      onTravelDialogOpened={() => gameService.send("SAVE")}
      travelAllowed={!gameState.matches("autosaving")}
    />
  );
};
