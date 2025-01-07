import React, { useContext, useEffect, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { GroupedMessages } from "@/containers/Thread/threads";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { RowRenderer } from "./RowRenderer";

interface ChatRenderProps {
  messages: GroupedMessages[];
}

export const RenderChatThread = React.memo(function RenderChatThread({
  messages,
}: ChatRenderProps) {
  const scrollableRef = useRef<VirtuosoHandle | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const { thread } = useContext(ThreadContext);

  useEffect(() => {
    if (!scrollableRef.current) return;
    if (atBottom) {
      scrollableRef.current?.autoscrollToBottom();
    }
  }, [scrollableRef.current, messages]);

  const atBottomStateChange = (atBottom: boolean) => {
    setAtBottom(atBottom);

    if (atBottom) {
      thread.loadNewer();
    }
  };

  const atTopStateChange = (atTop: boolean) => {
    if (atTop) {
      thread.loadOlder();
    }
  };

  return (
    <Virtuoso
      followOutput={"smooth"}
      ref={scrollableRef}
      atBottomStateChange={atBottomStateChange}
      atBottomThreshold={10}
      atTopStateChange={atTopStateChange}
      atTopThreshold={100}
      initialTopMostItemIndex={messages.length}
      data={messages}
      style={{ width: "100%", height: "100%" }}
      itemContent={RowRenderer}
      itemSize={(element: HTMLElement) =>
        element.getBoundingClientRect().height
      }
      increaseViewportBy={2000}
    />
  );
});
