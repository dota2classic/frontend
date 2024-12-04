import { ThreadMessageDTO } from "@/api/back";
import { ThreadStyle } from "@/components/Thread/types";

export interface IMessageProps {
  message: ThreadMessageDTO;
  threadStyle: ThreadStyle;
  onDelete?: () => void;
  onMute?: () => void;
}
