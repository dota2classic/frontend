import { ThreadType } from "@/api/mapped-models";
import React from "react";
import c from "./Debug.module.scss";
import { Thread } from "@/containers";
import { ThreadStyle } from "@/containers/Thread/types";

export default function DebugPage() {
  return (
    <>
      <h1>hello2</h1>
      <h3>amoooogubich pld</h3>
      <div style={{ height: 400, width: "100%" }}>
        <Thread
          scrollToLast
          className={c.thread}
          showLastMessages={100}
          threadStyle={ThreadStyle.CHAT}
          id={"17aa3530-d152-462e-a032-909ae69019ed"}
          threadType={ThreadType.FORUM}
        />
      </div>
    </>
  );
}
