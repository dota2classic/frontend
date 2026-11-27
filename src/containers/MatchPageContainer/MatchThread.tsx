import { Thread } from "../Thread";
import { ThreadType } from "@/api/mapped-models";
import c from "@/pages/matches/Match.module.scss";
import React from "react";

export const MatchThread = ({
  id,
  reportsEnabled,
}: {
  id: string;
  reportsEnabled: boolean;
}) => {
  return (
    <Thread
      id={id}
      reportsEnabled={reportsEnabled}
      threadType={ThreadType.MATCH}
      className={c.queueDiscussion}
    />
  );
};
