import React, { useCallback, useRef, useState } from "react";
import { FaRegFaceGrinTongueSquint } from "react-icons/fa6";
import { createPortal } from "react-dom";
import { EmoticonDto } from "@/api/back";
import { EmoticonSelectWindow } from "../EmoticonSelectWindow";

interface Props {
  onAddReaction: (e: EmoticonDto) => void;
}
export const AddEmoticonButton = React.memo(function AddReactionTool({
  onAddReaction,
}: Props) {
  const emoticonAnchorRef = useRef<HTMLElement | null>(null);

  const [visible, setVisible] = useState(false);

  const react = useCallback(onAddReaction, [onAddReaction]);

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
