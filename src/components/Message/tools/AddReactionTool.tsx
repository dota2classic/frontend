import React, { useCallback, useContext, useRef, useState } from "react";
import { EmoticonDto } from "@/api/back";
import { EmoticonSelectWindow } from "@/components";
import { createPortal } from "react-dom";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { FaGrinTongueSquint } from "react-icons/fa";

interface Props {
  messageId: string;
}

export const AddReactionTool = React.memo(function AddReactionTool({
  messageId,
}: Props) {
  const thread = useContext(ThreadContext);

  const emoticonAnchorRef = useRef<HTMLElement | null>(null);

  const [visible, setVisible] = useState(false);

  const react = useCallback(
    (e: EmoticonDto) => {
      thread.react(messageId, e.id);
    },
    [thread, messageId],
  );

  const showEmoticonWindow = useCallback(() => {
    if (!emoticonAnchorRef.current) return;

    setVisible(true);
  }, []);

  return (
    <>
      <span ref={emoticonAnchorRef}>
        <FaGrinTongueSquint onClick={showEmoticonWindow} />
      </span>
      {visible &&
        createPortal(
          <EmoticonSelectWindow
            onSelect={react}
            anchor={emoticonAnchorRef}
            onClose={() => setVisible(false)}
          />,
          document.body,
        )}
    </>
  );
});
