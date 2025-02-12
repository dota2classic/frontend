import { Panel } from "@/components";

export default function SteamAuthError() {
  return (
    <Panel style={{ flexDirection: "column", padding: "24px" }}>
      <h1>Steam в данный момент не отвечает на запросы авторизации!</h1>
      <p style={{ lineHeight: "1.5em" }}>
        Пожалуйста, попробуй авторизоваться позже. Все сайты, на которые можно
        зайти через <span className="gold">Steam</span> сейчас лишились этой
        возможности. Уверены, скоро это починится.
      </p>
      <img
        // style={{ width: "90%" }}
        src="/landing/4.png"
        alt="sobaka here"
      />
    </Panel>
  );
}
