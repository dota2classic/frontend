import { useMedia } from "react-use";

export const useShowSideAdBlocks = () => {
  return useMedia("(min-width: 1250)", true);
};
