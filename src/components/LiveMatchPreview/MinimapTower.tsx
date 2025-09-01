import { remapNumber } from "@/util/math";
import cx from "clsx";
import c from "@/components/LiveMatchPreview/LiveMatchPreview.module.scss";
import { getTowerState } from "@/util/getTowerState";
import React from "react";

interface TowerProps {
  tower: TowerPosition;
  team: number;
  alive: boolean;
  type: "tower" | "barrack" | "ancient";
  lowX?: number;
  lowY?: number;
  highX?: number;
  highY?: number;
  tilt?: boolean;
}

const Tower = ({
  tower,
  team,
  alive,
  type,
  lowX,
  lowY,
  highY,
  highX,
  tilt,
}: TowerProps) => {
  const { x, y } = tower;

  const remappedX = remapNumber(x, 0, 1, lowX || 0.02, highX || 0.96) * 100;
  const remappedY = remapNumber(y, 0, 1, lowY || 0.04, highY || 0.94) * 100;

  return (
    <span
      key={tower.bit}
      className={cx(
        c.building,
        type === "tower" ? c.tower : type === "ancient" ? c.ancient : c.barrack,
        team === 2 ? c.building__radiant : c.building__dire,
        alive ? c.building__alive : c.building__dead,
        tilt && c.building__middle,
      )}
      style={{
        left: `${remappedX}%`,
        bottom: `${remappedY}%`,
      }}
    />
  );
};

interface TowerPosition {
  bit: number;
  x: number;
  y: number;
}

const radiant = [
  { x: 0.07, y: 0.63, bit: 0 },
  { x: 0.072, y: 0.441, bit: 1 },
  { x: 0.052, y: 0.264, bit: 2 },

  { x: 0.393, y: 0.405, bit: 3 },
  { x: 0.261, y: 0.296, bit: 4 },
  { x: 0.174, y: 0.21, bit: 5 },

  { x: 0.845, y: 0.1, bit: 6 },
  { x: 0.46, y: 0.069, bit: 7 },
  { x: 0.226, y: 0.067, bit: 8 },

  { x: 0.098, y: 0.154, bit: 9 },
  { x: 0.118, y: 0.134, bit: 10 },
];

const radiantBarracks = [
  { x: 0.062, y: 0.243, bit: 0 },
  { x: 0.032, y: 0.243, bit: 1 },
  { x: 0.168, y: 0.179, bit: 2 },
  { x: 0.143, y: 0.204, bit: 3 },
  { x: 0.2, y: 0.049, bit: 4 },
  { x: 0.2, y: 0.085, bit: 5 },
];

const dire = [
  { x: 0.165, y: 0.915, bit: 0 },
  { x: 0.5, y: 0.912, bit: 1 },
  { x: 0.747, y: 0.9, bit: 2 },

  { x: 0.56, y: 0.528, bit: 3 },
  { x: 0.676, y: 0.649, bit: 4 },
  { x: 0.79, y: 0.762, bit: 5 },

  { x: 0.908, y: 0.382, bit: 6 },
  { x: 0.908, y: 0.527, bit: 7 },
  { x: 0.908, y: 0.71, bit: 8 },

  { x: 0.85, y: 0.838, bit: 9 },
  { x: 0.873, y: 0.813, bit: 10 },
];

const direBarracks = [
  { x: 0.768, y: 0.887, bit: 0 },
  { x: 0.768, y: 0.925, bit: 1 },

  { x: 0.821, y: 0.766, bit: 2 },
  { x: 0.795, y: 0.792, bit: 3 },

  { x: 0.898, y: 0.735, bit: 4 },
  { x: 0.929, y: 0.735, bit: 5 },
];

const radiantAncient = { x: 0.068, y: 0.101, bit: 0 };
const direAncient = { x: 0.876, y: 0.843, bit: 0 };

export const MinimapTowers = ({
  towers: towerState,
  barracks: barrackState,
}: {
  towers: number[];
  barracks: number[];
}) => {
  towerState = towerState || [2047, 2047];
  barrackState = barrackState || [63, 63];
  return (
    <>
      <Tower tilt type="ancient" team={2} tower={radiantAncient} alive={true} />
      <Tower tilt type="ancient" team={3} tower={direAncient} alive={true} />
      {radiantBarracks.map((barrack) => (
        <Tower
          lowX={0.033}
          lowY={0.05}
          type="barrack"
          key={`radiant_${barrack.bit}`}
          tower={barrack}
          team={2}
          tilt={[2, 3].includes(barrack.bit)}
          alive={getTowerState(barrackState[0], barrack.bit)}
        />
      ))}

      {direBarracks.map((barrack) => (
        <Tower
          lowX={0.033}
          lowY={0.05}
          type="barrack"
          key={`dire_${barrack.bit}`}
          tower={barrack}
          team={3}
          tilt={[2, 3].includes(barrack.bit)}
          alive={getTowerState(barrackState[1], barrack.bit)}
        />
      ))}

      {radiant.map((tower) => (
        <Tower
          type="tower"
          key={`radiant_${tower.bit}`}
          tower={tower}
          team={2}
          tilt={[3, 4, 5, 9, 10].includes(tower.bit)}
          alive={getTowerState(towerState[0], tower.bit)}
        />
      ))}
      {dire.map((tower) => (
        <Tower
          type="tower"
          key={`dire_${tower.bit}`}
          tower={tower}
          tilt={[3, 4, 5, 9, 10].includes(tower.bit)}
          team={3}
          alive={getTowerState(towerState[1], tower.bit)}
        />
      ))}
    </>
  );
};
