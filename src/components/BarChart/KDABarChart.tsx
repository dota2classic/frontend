import React, { useMemo } from "react";
import { BarChart } from "./BarChart";

interface KDABarChart {
  kills: number;
  deaths: number;
  assists: number;
}

export const KDABarChart: React.FC<KDABarChart> = ({
  kills,
  deaths,
  assists,
}) => {
  const data = useMemo(() => {
    const data = [
      { color: "#c23c2a", value: kills },
      { color: "#979797", value: deaths },
      { color: "#92a525", value: assists },
    ];

    if (data.reduce((a, b) => a + b.value, 0) === 0) {
      return data.map((t) => ({ color: t.color, value: 1 }));
    }
    return data;
  }, [kills, deaths, assists]);

  return <BarChart data={data} />;
};
