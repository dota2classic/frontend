import c from "./Wiki.module.scss";

export default function WikiEmbed() {
  return (
    <iframe src="https://wiki.dotaclassic.ru" className={c.iframe}></iframe>
  );
}
