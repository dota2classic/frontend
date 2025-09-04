import { NavbarItem } from "../NavbarItem";
import { AppRouter } from "@/route";

import c from "./Navbar.module.scss";
import { MdLocalPolice } from "react-icons/md";
import { useTranslation } from "react-i18next";

export const AdminNavbarItem = () => {
  const { t } = useTranslation();

  return (
    <NavbarItem
      className={c.navbar__admin}
      action={AppRouter.admin.queues.link}
      options={[
        {
          label: t("admin_navbar.servers"),
          action: AppRouter.admin.servers.link,
        },
        {
          label: t("admin_navbar.violations"),
          action: AppRouter.admin.crimes().link,
        },

        {
          newCategory: true,
          label: t("admin_navbar.settings"),
          action: AppRouter.admin.feedback.index.link,
        },
        {
          label: t("admin_navbar.list"),
          action: AppRouter.admin.crimes().link,
        },
        {
          newCategory: true,
          label: t("admin_navbar.decorations"),
          action: AppRouter.admin.decoration.list().link,
        },
        {
          label: t("admin_navbar.rules"),
          action: AppRouter.admin.rules.editRules.link,
        },
      ]}
    >
      <MdLocalPolice />
    </NavbarItem>
  );
};
