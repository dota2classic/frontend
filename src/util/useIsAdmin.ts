import { useStore } from "@/store";
import { Role } from "@/api/mapped-models";

export const useIsAdmin = () => {
  const t = useStore().auth.parsedToken;

  return t ? t.roles.includes(Role.ADMIN) : false;
};
