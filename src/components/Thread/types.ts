import { ThreadType } from "@/api/mapped-models";
import { ThreadMessageDTO, ThreadMessagePageDTO } from "@/api/back";
import { NextLinkProp } from "@/route";

export enum ThreadStyle {
  NORMAL,
  SMALL,
  TINY,
}

export interface IThreadProps {
  id: string;
  threadType: ThreadType;
  className?: string;
  populateMessages?: ThreadMessageDTO[] | ThreadMessagePageDTO;
  threadStyle?: ThreadStyle;
  showLastMessages?: number;
  scrollToLast?: boolean;
  pagination?: {
    pageProvider: (page: number) => NextLinkProp;
    page: number;
  };
}
