import React, { useCallback, useContext, useRef, useState } from "react";
import { ThreadContext } from "@/util/threads";
import { EmoticonDto } from "@/api/back";
import { FaRegFaceGrinTongueSquint } from "react-icons/fa6";
import { EmoticonSelectWindow } from "@/components";
import { createPortal } from "react-dom";

interface Props {
  messageId: string;
}

export const AddReactionTool = React.memo(function AddReactionTool({
  messageId,
}: Props) {
  const threadCtx = useContext(ThreadContext);

  const emoticonAnchorRef = useRef<HTMLElement | null>(null);

  const [visible, setVisible] = useState(false);

  const react = useCallback(
    (e: EmoticonDto) => {
      threadCtx.thread.react(messageId, e.id);
    },
    [threadCtx, messageId],
  );

  const showEmoticonWindow = useCallback(() => {
    if (!emoticonAnchorRef.current) return;

    setVisible(true);
  }, []);

  return (
    <>
      <span ref={emoticonAnchorRef}>
        <FaRegFaceGrinTongueSquint onClick={showEmoticonWindow} />
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
