import React, { useEffect } from "react";
import { useStore } from "@/store";
import { FocusOwner } from "@/store/GreedyFocusStore";

export const useGreedyFocus = (
  priority: number | undefined,
  ref: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>,
) => {
  const { greedyFocus } = useStore();
  useEffect(() => {
    if (!ref.current || priority === undefined) return;
    const owner: FocusOwner = {
      priority,
      ref: ref.current!,
    };
    greedyFocus.requestOwnership(owner);

    return () => greedyFocus.revokeOwnership(owner);
  }, [greedyFocus, priority, ref]);
};

export const useTypingCallback = (callback: () => void, active = true) => {
  useEffect(() => {
    const windowKeyDown = (e: KeyboardEvent) => {
      // Auto-focus the current input when a key is typed
      if (!(e.ctrlKey || e.metaKey || e.altKey)) {
        callback();
      }
    };

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