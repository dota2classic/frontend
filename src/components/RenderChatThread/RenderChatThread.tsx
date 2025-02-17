import React, { useContext, useMemo, useRef, useTransition } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { observer } from "mobx-react-lite";
import { ThreadMessageDTO } from "@/api/back";
import { Message } from "@/components";
import { ThreadContext } from "@/containers/Thread/threadContext";

export const RenderChatThread = observer(function RenderChatThread() {
  const thread = useContext(ThreadContext);

  const pool = thread.pool;

  const scrollableRef = useRef<VirtuosoHandle | null>(null);
  const [isLoadingOlder, startTransition] = useTransition();

  const renderChat = useMemo(() => pool.length > 0, [pool.length]);

  const firstItemIndex = useMemo(() => 100000 - pool.length, [pool.length]);

  const startReached = () => {
    if (thread.isThreadReady && !isLoadingOlder) {
      startTransition(async () => {
        thread.loadOlder().catch();
      });
    }
  };

  if (!renderChat) return null;

  return (
    <Virtuoso
      followOutput={"auto"}
      ref={(e) => {
        scrollableRef.current = e;
        thread.setScrollRef(e || undefined);
      }}
      computeItemKey={(idx, d) => d[0].messageId}
      skipAnimationFrameInResizeObserver={true}
      atBottomThreshold={10}
      startReached={startReached}
      firstItemIndex={firstItemIndex}
      data={pool}
      initialTopMostItemIndex={pool.length === 0 ? undefined : pool.length - 1}
      style={{ width: "100%", height: "100%" }}
      itemContent={(idx, [msg, header]: [ThreadMessageDTO, boolean]) => {
        return <Message message={msg} header={header} lightweight={false} />;
      }}
      alignToBottom
      increaseViewportBy={{
        top: 600,
        bottom: 200,
      }}
    />
  );
});
