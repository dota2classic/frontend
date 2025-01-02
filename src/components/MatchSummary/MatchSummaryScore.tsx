import c from "@/components/MatchSummary/MatchSummary.module.scss";
import { Duration } from "@/components";
import React from "react";

export const MatchSummaryScore = ({
  radiantKills,
  direKills,
  duration,
}: {
  radiantKills: number;
  direKills: number;
  duration: number;
}) => {
  return (
    <div className={c.matchWinner__score}>
      <div className={c.radiant}>{radiantKills}</div>
      <div className={c.matchWinner__duration}>
        <Duration duration={duration} />
      </div>
      <div className={c.dire}>{direKills}</div>
    </div>
  );
};
