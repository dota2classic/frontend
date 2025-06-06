import { useStore } from "@/store";
import { Role } from "@/api/mapped-models";

export const useIsAdmin = () => {
  const t = useStore().auth.parsedToken;

  return t ? t.roles.includes(Role.ADMIN) : false;
};

export const useIsModerator = () => {
  const t = useStore().auth.parsedToken;

  return t
    ? t.roles.includes(Role.MODERATOR) || t.roles.includes(Role.ADMIN)
    : false;
};

export const useIsOld = () => {
  const t = useStore().auth.parsedToken;
  const isModerator = useIsModerator();

  return t ? t.roles.includes(Role.OLD) || isModerator : false;
};
