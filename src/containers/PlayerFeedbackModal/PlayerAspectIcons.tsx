import { PlayerAspect } from "@/api/mapped-models";
import type { IconType } from "react-icons";
import { FaPeopleGroup } from "react-icons/fa6";
import { GiClown, GiPoisonBottle } from "react-icons/gi";
import { BsEmojiSunglasses } from "react-icons/bs";
import { IoIosChatbubbles } from "react-icons/io";

export const PlayerAspectIcons: {
  aspect: PlayerAspect;
  Icon: IconType;
}[] = [
  {
    aspect: PlayerAspect.FRIENDLY,
    Icon: FaPeopleGroup,
  },
  {
    aspect: PlayerAspect.OPTIMIST,
    Icon: BsEmojiSunglasses,
  },
  {
    aspect: PlayerAspect.TALKATIVE,
    Icon: IoIosChatbubbles,
  },
  {
    aspect: PlayerAspect.TOXIC,
    Icon: GiPoisonBottle,
  },
  {
    aspect: PlayerAspect.CLOWN,
    Icon: GiClown,
  },
];
