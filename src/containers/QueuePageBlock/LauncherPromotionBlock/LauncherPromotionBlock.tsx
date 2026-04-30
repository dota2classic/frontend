import React from "react";
import c from "./LauncherPromotionBlock.module.scss";
import { useTranslation } from "react-i18next";
import { QueueButton } from "@/components/QueueButton/QueueButton";

export const LauncherPromotionBlock: React.FC = () => {
  const { t } = useTranslation();

  const handleDownloadLauncher = () => {
    window.open("https://dotaclassic.ru/download", "_blank");
  };

  const benefits = [
    t("queue_page.launcher.benefit1"),
    t("queue_page.launcher.benefit2"),
    t("queue_page.launcher.benefit3"),
    t("queue_page.launcher.benefit4"),
  ];

  return (
    <div className={c.landingContainer}>
      <div className={c.screenshotContainer}>
        <img
          src="/launcher.png"
          alt="Launcher preview"
          className={c.screenshot}
        />
      </div>

      <div className={c.contentContainer}>
        <h2 className={c.title}>{t("queue_page.launcher.sectionTitle")}</h2>

        <p className={c.description}>{t("queue_page.launcher.description")}</p>

        <ul className={c.benefits}>
          {benefits.map((benefit, index) => (
            <li key={index} className={c.benefitItem}>
              {benefit}
            </li>
          ))}
        </ul>

        <QueueButton onClick={handleDownloadLauncher} className={c.button}>
          {t("queue_page.launcher.downloadButton")}
        </QueueButton>
      </div>
    </div>
  );
};
