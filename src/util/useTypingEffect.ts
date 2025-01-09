import React, { useEffect } from "react";

export const useTypingEffect = (
  ref: React.RefObject<HTMLTextAreaElement | null>,
  active = true,
) => {
  const windowKeyDown = (e: KeyboardEvent) => {
    if (!ref.current) return;
    // Auto-focus the current input when a key is typed
    if (!(e.ctrlKey || e.metaKey || e.altKey)) {
      ref.current!.focus();
    }
  };

  useEffect(() => {
    if (active) {
      window.addEventListener("keydown", windowKeyDown);
    } else {
      window.removeEventListener("keydown", windowKeyDown);
    }

    return () => {
      if (active) {
        window.removeEventListener("keydown", windowKeyDown);
      }
    };
  }, [active]);
};
