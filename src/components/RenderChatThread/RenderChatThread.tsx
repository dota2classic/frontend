import React, { useEffect, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { MessageGroup } from "@/components";

function fractionalItemSize(element: HTMLElement) {
  return element.getBoundingClientRect().height;
}

interface ChatRenderProps {
  messages: GroupedMessages[];
  thread: ThreadLocalState;
}

const RowRenderer = (index: number, msg: GroupedMessages) => {
  return <MessageGroup messages={msg.messages} />;
};


{/*<div*/}
{/*  className={cx(*/}
{/*    c.unseenMessages,*/}
{/*    unseenMessageCount && c.unseenMessages__visible,*/}
{/*  )}*/}
{/*  onClick={() => scrollToBottom(true)}*/}
{/*>*/}
{/*  {unseenMessageCount} новых сообщений*/}
{/*</div>*/}

export const RenderChatThread = React.memo(function RenderChatThread({
  thread,
  messages,
}: ChatRenderProps) {
  const scrollableRef = useRef<VirtuosoHandle | null>(null);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    if (!scrollableRef.current) return;
    if (atBottom) {
      scrollableRef.current!.scrollToIndex(messages.length - 1);
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
      startReached={(idx) => {
        console.log("STart reachd", idx);
      }}
      initialTopMostItemIndex={messages.length - 1}
      data={messages}
      style={{ width: "100%", height: "100%" }}
      itemContent={RowRenderer}
      itemSize={fractionalItemSize}
      increaseViewportBy={2000}
    />
  );
});
