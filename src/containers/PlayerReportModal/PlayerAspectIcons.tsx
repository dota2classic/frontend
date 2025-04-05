import { PlayerAspect } from "@/api/mapped-models";
import type { IconType } from "react-icons";
import { FaPeopleGroup, FaWheelchairMove } from "react-icons/fa6";
import { GiCrownedSkull, GiPoisonBottle } from "react-icons/gi";
import { MdRecommend } from "react-icons/md";

export const PlayerAspectIcons: {
  aspect: PlayerAspect;
  Icon: IconType;
}[] = [
  {
    aspect: PlayerAspect.FRIENDLY,
    Icon: FaPeopleGroup,
  },
  {
    aspect: PlayerAspect.WINNER,
    Icon: GiCrownedSkull,
  },
  {
    aspect: PlayerAspect.GOOD,
    Icon: MdRecommend,
  },
  {
    aspect: PlayerAspect.TOXIC,
    Icon: GiPoisonBottle,
  },
  {
    aspect: PlayerAspect.RUINER,
    Icon: FaWheelchairMove,
  },
];
