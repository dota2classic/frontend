import React, { useEffect, useRef, useState } from "react";

import { MessageGroup, Pagination } from "..";
import c from "./Thread.module.scss";
import { observer } from "mobx-react-lite";
import { Rubik } from "next/font/google";
import cx from "clsx";
import {
  GroupedMessages,
  ThreadContext,
  ThreadLocalState,
  useNewThread,
} from "@/util/threads";
import { useStore } from "@/store";
import { IThreadProps, ThreadStyle } from "@/components/Thread/types";
import { MessageInput } from "@/components/Thread/MessageInput";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import {
  EmoticonTooltipContext,
  EmoticonTooltipContextData,
} from "@/util/hooks";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

function fractionalItemSize(element: HTMLElement) {
  return element.getBoundingClientRect().height;
}

const RowRenderer = (index: number, msg: GroupedMessages) => {
  return <MessageGroup messages={msg.messages} />;
};

// const useScrollToBottom = (
//   scrollToLast: boolean,
//   scrollableRef: React.RefObject<HTMLElement | null>,
//   threadView: ThreadView,
// ): [(smooth: boolean) => void, number] => {
//   const [sticky, setSticky] = useState(scrollToLast);
//   const [lastSeenMessageTime, setLastSeenMessageTime] = useState<
//     number | undefined
//   >(undefined);
//
//   const unseenMessageCount = useMemo(() => {
//     return sticky || lastSeenMessageTime === undefined
//       ? 0
//       : threadView.groupedMessages
//           .flatMap((group) => group.messages)
//           .filter(
//             (message) =>
//               new Date(message.createdAt).getTime() > lastSeenMessageTime,
//           ).length;
//   }, [lastSeenMessageTime, threadView.groupedMessages, sticky]);
//
//   const scrollToBottom = useCallback(
//     (smooth?: boolean) => {
//       const element = scrollableRef.current;
//       if (!element) return;
//       element.scroll({
//         top: element.scrollHeight,
//         behavior: smooth ? "smooth" : "instant",
//       });
//     },
//     [scrollableRef],
//   );
//
//   useEffect(() => {
//     if (!sticky) return;
//
//     if (threadView.groupedMessages.length > 0 && scrollToLast) {
//       scrollToBottom();
//
//       const m =
//         threadView.groupedMessages[threadView.groupedMessages.length - 1]
//           .messages;
//       setLastSeenMessageTime(new Date(m[m.length - 1].createdAt).getTime());
//     }
//   }, [threadView, sticky]);
//
//   useEffect(() => {
//     const t = scrollableRef.current;
//     if (!t) return;
//
//     const listener = () => {
//       const sticked =
//         Math.abs(t.scrollHeight - t.scrollTop - t.offsetHeight) < 10;
//       setSticky(sticked);
//     };
//     t.addEventListener("scrollend", listener);
//     return () => t.removeEventListener("scrollend", listener);
//   }, [scrollableRef]);
//
//   return [scrollToBottom, unseenMessageCount];
// };

interface ChatRenderProps {
  messages: GroupedMessages[];
  thread: ThreadLocalState;
}

const RenderForumThread = React.memo(function RenderForumThread({
  messages,
}: ChatRenderProps) {
  return (
    <>
      {messages.map((message) => (
        <MessageGroup
          key={message.messages[0].messageId}
          messages={message.messages}
        />
      ))}
    </>
  );
});

const RenderChatThread = React.memo(function RenderChatThread({
  thread,
  messages,
}: ChatRenderProps) {
  const scrollableRef = useRef<VirtuosoHandle | null>(null);

  useEffect(() => {
    if (!scrollableRef.current) return;
    scrollableRef.current!.scrollToIndex(messages.length - 1);
    console.log("Scroll bottom.", messages.length - 1);
  }, [scrollableRef.current, messages]);

  const atBottomStateChange = (atBottom: boolean) => {
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
      atBottomThreshold={100}
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

export const Thread: React.FC<IThreadProps> = observer(function Thread({
  threadType,
  id,
  className,
  populateMessages,
  threadStyle,
  showLastMessages,
  pagination,
}) {
  const { threads } = useStore();
  const [owner, setOwner] =
    useState<EmoticonTooltipContextData["owner"]>(undefined);

  useEffect(() => {
    threads.loadEmoticons();
  }, []);

  const thread = useNewThread(
    id,
    threadType,
    populateMessages,
    (showLastMessages && showLastMessages > 0) || false,
    pagination?.page,
  );

  const displayInput =
    !pagination ||
    !thread.pg ||
    thread.pg.pages === 1 ||
    thread.pg.page == thread.pg.pages - 1;

  const messages = thread.threadView.groupedMessages;

  useEffect(() => {
    thread.loadOlder();
  }, []);

  return (
    <ThreadContext.Provider
      value={{
        thread,
        emoticons: threads.emoticons,
      }}
    >
      <EmoticonTooltipContext.Provider
        value={{
          owner,
          setOwner,
        }}
      >
        <div className={cx(c.thread, threadFont.className, className)}>
          {pagination && (
            <Pagination
              page={pagination.page}
              maxPage={thread.pg?.pages || 0}
              linkProducer={(page) => pagination!.pageProvider(page)}
            />
          )}
          <div
            className={cx(
              c.messageContainer,
              "messageList",
              threadStyle === ThreadStyle.FORUM && c.messageContainer__forum,
              c.messageContainer__tiny,
            )}
          >
            {threadStyle === ThreadStyle.CHAT ? (
              <RenderChatThread thread={thread} messages={messages} />
            ) : (
              <RenderForumThread messages={messages} thread={thread} />
            )}
          </div>
          {/*<div*/}
          {/*  className={cx(*/}
          {/*    c.unseenMessages,*/}
          {/*    unseenMessageCount && c.unseenMessages__visible,*/}
          {/*  )}*/}
          {/*  onClick={() => scrollToBottom(true)}*/}
          {/*>*/}
          {/*  {unseenMessageCount} новых сообщений*/}
          {/*</div>*/}
          {pagination && (
            <Pagination
              page={pagination.page}
              maxPage={thread.pg?.pages || 0}
              linkProducer={(page) => pagination!.pageProvider(page)}
            />
          )}
          {displayInput && (
            <MessageInput
              rows={1}
              canMessage={true}
              threadId={`${thread.thread.type}_${thread.id}`}
              onMessage={(msg) => thread.consumeMessages([msg])}
            />
          )}
        </div>
      </EmoticonTooltipContext.Provider>
    </ThreadContext.Provider>
  );
});
