import { Button } from "@/components/Button";
import { EmbedProps } from "@/components/EmbedProps";
import { TrajanPro } from "@/const/fonts";
import cx from "clsx";
import c from "./MegaButtonsPage.module.scss";

const variants = [
  {
    eyebrow: "Baseline",
    title: "Default Mega",
    text: "The current untouched mega button, only stretched to card width.",
    className: "",
    label: "Настроить профиль",
  },
  {
    eyebrow: "Tighter",
    title: "Compact Width",
    text: "Same base style, but reduced padding and calmer tracking for modal use.",
    className: cx(c.compact, c.narrowTracking),
    label: "Настроить профиль",
  },
  {
    eyebrow: "Softer",
    title: "Thin Border",
    text: "Keeps the animated text look but removes some of the heavy frame weight.",
    className: cx(c.compact, c.softBorder, c.narrowTracking),
    label: "Настроить профиль",
  },
  {
    eyebrow: "Gold",
    title: "Gold Border",
    text: "Closer to the reward modal palette while still reusing the real mega button.",
    className: cx(c.compact, c.goldBorder, c.narrowTracking),
    label: "Настроить профиль",
  },
  {
    eyebrow: "Large",
    title: "Wide Hero",
    text: "This is the more theatrical version for store/paywall contexts.",
    className: cx(c.wide, c.tallTracking),
    label: "Открыть подписку",
  },
  {
    eyebrow: "Long Label",
    title: "Wrapping Stress Test",
    text: "Useful for checking whether long translated labels still feel good.",
    className: cx(c.compact, c.longLabel, c.narrowTracking),
    label: "Перейти к настройке и оформлению профиля",
  },
  {
    eyebrow: "Subtle",
    title: "Calmer Gradient",
    text: "Same component, less aggressive color contrast and slower shimmer.",
    className: cx(c.compact, c.softBorder, c.subtle, c.narrowTracking),
    label: "Настроить профиль",
  },
  {
    eyebrow: "Strong",
    title: "Hot Gradient",
    text: "Deliberately stronger highlight to compare against the softer versions.",
    className: cx(c.compact, c.goldBorder, c.intense, c.tallTracking),
    label: "Настроить профиль",
  },
];

export default function MegaButtonsPage() {
  return (
    <>
      <EmbedProps
        title="Mega Button Lab"
        description="Comparison page for dotaclassic mega button variants"
      />
      <main className={c.page}>
        <div className={c.shell}>
          <section className={c.hero}>
            <h1 className={cx(TrajanPro.className, "megaheading", c.heroTitle)}>
              Mega Button Lab
            </h1>
            <p className={c.heroText}>
              This page compares real `mega` button treatments built on top of
              the existing `Button` component. Pick the direction you want and I
              will port it into the claim modal.
            </p>
          </section>

          <section className={c.grid}>
            {variants.map((variant) => (
              <article className={c.card} key={variant.title}>
                <div className={c.cardHeader}>
                  <span className={c.eyebrow}>{variant.eyebrow}</span>
                  <h2 className={c.cardTitle}>{variant.title}</h2>
                  <p className={c.cardText}>{variant.text}</p>
                </div>

                <div className={c.preview}>
                  <span className={c.meta}>Preview</span>
                  <Button
                    mega
                    className={cx(c.button, variant.className)}
                    onClick={() => undefined}
                  >
                    {variant.label}
                  </Button>
                </div>
              </article>
            ))}

            <article className={c.card}>
              <div className={c.cardHeader}>
                <span className={c.eyebrow}>Framed</span>
                <h2 className={c.cardTitle}>Outer Panel</h2>
                <p className={c.cardText}>
                  Same mega button, but inside a separate gold panel. This is
                  useful if you want the button itself untouched and the extra
                  styling around it instead.
                </p>
              </div>

              <div className={c.preview}>
                <span className={c.meta}>Preview</span>
                <div className={c.panel}>
                  <div className={c.panelInner}>
                    <Button
                      mega
                      className={cx(c.button, c.compact, c.narrowTracking)}
                      onClick={() => undefined}
                    >
                      Настроить профиль
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            <article className={c.card}>
              <div className={c.cardHeader}>
                <span className={c.eyebrow}>Disabled</span>
                <h2 className={c.cardTitle}>Disabled State</h2>
                <p className={c.cardText}>
                  Quick sanity check for the disabled appearance, since some
                  variants can look odd once the gradient is removed.
                </p>
              </div>

              <div className={c.preview}>
                <span className={c.meta}>Preview</span>
                <Button mega className={cx(c.button, c.compact)} disabled>
                  Настроить профиль
                </Button>
                <span className={c.disabledNote}>
                  Disabled state uses the shared component styling without extra
                  overrides.
                </span>
              </div>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}
