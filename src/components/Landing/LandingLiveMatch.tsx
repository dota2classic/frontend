import { LiveMatchDto, LiveMatchDtoFromJSON } from "@/api/back";
import { SmallLiveMatch } from "@/components";
import { useEventSource } from "@/util";
import { getApi } from "@/api/hooks";
import React from "react";
import c from "./Landing.module.scss";

interface Props {
  seed: LiveMatchDto;
}
export const LandingLiveMatch: React.FC<Props> = ({ seed }) => {
  const liveMatch = useEventSource<LiveMatchDto>(
    getApi().liveApi.liveMatchControllerLiveMatchContext({ id: seed.matchId }),
    LiveMatchDtoFromJSON.bind(null),
  );

  if (!liveMatch) return null;

  return (
    <div className={c.liveMatchPreview}>
      <SmallLiveMatch match={liveMatch} />
    </div>
  );
};
