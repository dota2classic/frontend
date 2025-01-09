import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { observer } from "mobx-react-lite";
import { ThreadMessageDTO } from "@/api/back";
import { RenderMessageNew } from "@/components/Message/Message";

export const RenderChatThread = observer(function RenderChatThread() {
  const scrollableRef = useRef<VirtuosoHandle | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const { thread } = useContext(ThreadContext);
  const [isLoadingOlder, startTransition] = useTransition();

  const pool = thread.pool;

  const renderChat = useMemo(
    () => pool.length > 0 && thread.isThreadReady,
    [pool.length, thread.isThreadReady],
  );

  useEffect(() => {
    if (!scrollableRef.current) return;
    if (atBottom && thread.isThreadReady) {
      console.log("OK, lets scroll!");
      scrollableRef.current?.scrollToIndex(firstItemIndex + pool.length + 1);
    }
  }, [atBottom, thread.isThreadReady, pool]);

  const firstItemIndex = useMemo(() => 100000 - pool.length, [pool.length]);

  const atBottomStateChange = (atBottom: boolean) => {
    setAtBottom(atBottom);

    if (atBottom) {
      thread.loadNewer();
    }
  };

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
      followOutput={"smooth"}
      ref={scrollableRef}
      atBottomStateChange={atBottomStateChange}
      atBottomThreshold={10}
      startReached={startReached}
      firstItemIndex={firstItemIndex}
      data={pool}
      initialTopMostItemIndex={pool.length}
      style={{ width: "100%", height: "100%" }}
      itemContent={(_, [msg, header]: [ThreadMessageDTO, boolean]) => {
        return (
          <RenderMessageNew message={msg} header={header} lightweight={false} />
        );
      }}
      increaseViewportBy={{
        top: 600,
        bottom: 200,
      }}
    />
  );
});
