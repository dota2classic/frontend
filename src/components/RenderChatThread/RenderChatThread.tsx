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
import { Message } from "@/components";

export const RenderChatThread = observer(function RenderChatThread() {
  const scrollableRef = useRef<VirtuosoHandle | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const { thread, input } = useContext(ThreadContext);
  const [isLoadingOlder, startTransition] = useTransition();

  const pool = thread.pool;

  const renderChat = useMemo(
    () => pool.length > 0 && thread.isThreadReady,
    [pool.length, thread.isThreadReady],
  );

  useEffect(() => {
    if (!scrollableRef.current) return;
    if (atBottom && thread.isThreadReady && pool.length > 0) {
      console.log("OK, lets scroll!");
      scrollableRef.current?.scrollToIndex(pool.length);
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
      ref={(e) => {
        scrollableRef.current = e;
        input.setScrollRef(e || undefined);
      }}
      atBottomStateChange={atBottomStateChange}
      atBottomThreshold={10}
      startReached={startReached}
      firstItemIndex={firstItemIndex}
      data={pool}
      // initialTopMostItemIndex={pool.length === 0 ? undefined : pool.length}
      style={{ width: "100%", height: "100%" }}
      itemContent={(_, [msg, header]: [ThreadMessageDTO, boolean]) => {
        return <Message message={msg} header={header} lightweight={false} />;
      }}
      increaseViewportBy={{
        top: 600,
        bottom: 200,
      }}
    />
  );
});