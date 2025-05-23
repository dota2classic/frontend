import { NavbarItem } from "@/components";
import { AppRouter } from "@/route";

import c from "./Navbar.module.scss";
import { MdLocalPolice } from "react-icons/md";

export const AdminNavbarItem = () => {
  return (
    <NavbarItem
      className={c.navbar__admin}
      action={AppRouter.admin.queues.link}
      options={[
        {
          label: "Сервера",
          action: AppRouter.admin.servers.link,
        },
        {
          label: "Нарушения",
          action: AppRouter.admin.crimes().link,
        },

        {
          newCategory: true,
          label: "Ф:Настройки",
          action: AppRouter.admin.feedback.index.link,
        },
        {
          label: "Ф:Список",
          action: AppRouter.admin.crimes().link,
        },
        {
          newCategory: true,
          label: "Декорации",
          action: AppRouter.admin.decoration.list().link,
        },
      ]}
    >
      <MdLocalPolice />
    </NavbarItem>
  );
};
