import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { IoIosPin } from "react-icons/io";

interface Props {
  messageId: string;
}
export const PinMessageTool = React.memo(
  observer(function PinMessageTool({ messageId }: Props) {
    const { auth } = useStore();
    const thread = useContext(ThreadContext);

    if (!auth.isAdmin && !auth.isModerator) return null;

    return <IoIosPin onClick={() => thread.pinMessage(messageId)} />;
  }),
);
