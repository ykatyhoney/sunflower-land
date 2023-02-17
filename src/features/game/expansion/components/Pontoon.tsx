import React, { useContext, useEffect, useState } from "react";

import pontoon from "assets/land/levels/pontoon.gif";
import island from "assets/land/islands/island.webp";

import { LandExpansion } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";
import { TimerPopover } from "features/island/common/TimerPopover";

interface Props {
  expansion: LandExpansion;
}

/**
 * Goblins working hard constructing a piece of land
 */
export const Pontoon: React.FC<Props> = ({ expansion }) => {
  const { gameService, showTimers } = useContext(Context);

  const [showPopover, setShowPopover] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    (expansion.readyAt - Date.now()) / 1000
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = (expansion.readyAt - Date.now()) / 1000;
      setSecondsLeft(seconds);

      if (seconds <= 0) {
        gameService.send("expansion.revealed");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Land is still being built
  const constructionTime = Math.floor(
    (expansion.readyAt - expansion.createdAt) / 1000
  );

  return (
    <div
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
      className="w-full h-full"
    >
      <img
        src={pontoon}
        style={{
          top: `${PIXEL_SCALE * 20}px`,
          left: `${PIXEL_SCALE * -10}px`,
          width: `${PIXEL_SCALE * 129}px`,
        }}
        className="relative max-w-none"
      />
      <TimerPopover
        image={island}
        name="Next Expansion"
        showPopover={showPopover}
        timeLeft={secondsLeft}
        position={{ top: 10, left: 23 }}
      />
      {showTimers && (
        <ProgressBar
          seconds={secondsLeft}
          percentage={
            ((constructionTime - secondsLeft) / constructionTime) * 100
          }
          type="progress"
          formatLength="medium"
          style={{
            top: `${PIXEL_SCALE * 82}px`,
            left: `${PIXEL_SCALE * 45}px`,
          }}
        />
      )}
    </div>
  );
};
