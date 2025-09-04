import { Thread } from "../Thread";
import { ThreadType } from "@/api/mapped-models";
import c from "@/pages/matches/Match.module.scss";
import React from "react";

export const MatchThread = ({ id }: { id: string }) => {
  return (
    <Thread
      id={id}
      threadType={ThreadType.MATCH}
      className={c.queueDiscussion}
    />
  );
};
