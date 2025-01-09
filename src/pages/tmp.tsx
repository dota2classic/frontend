import React from "react";
import { ThreadType } from "@/api/back";
import { ThreadStyle } from "@/containers/Thread/types";
import cx from "clsx";
import { Thread } from "@/containers";
import c from "./queue/Queue.module.scss";

export default function Tmp() {
  return (
    <Thread
      scrollToLast
      className={cx(c.queueDiscussion, c.deleteMe)}
      showLastMessages={100}
      threadStyle={ThreadStyle.CHAT}
      id={"17aa3530-d152-462e-a032-909ae69019ed"}
      threadType={ThreadType.FORUM}
    />
  );
}
