import { ThreadMessageDTO, UserDTO } from "@/api/back";
import { ThreadType } from "@/api/mapped-models/ThreadType";

export interface GroupedMessages {
  author: UserDTO;
  displayDate: string;
  messages: ThreadMessageDTO[];
}
export interface ThreadView {
  id: string;
  type: ThreadType;
  groupedMessages: GroupedMessages[];
}
