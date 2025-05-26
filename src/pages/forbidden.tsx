import { EmbedProps, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";

export default function SteamAuthError() {
  return (
    <>
      <EmbedProps
        title={"Доступ запрещен"}
        description={"У тебя нет прав доступа к этой странице"}
      />
      <Panel style={{ flexDirection: "column", padding: "24px" }}>
        <h1>У тебя нет прав для просмотра этой страницы</h1>
        <p style={{ lineHeight: "1.5em" }}>
          <PageLink link={AppRouter.index.link}>Вернуться на главную</PageLink>
        </p>
        <img
          // style={{ width: "90%" }}
          src="/landing/4.png"
          alt="sobaka here"
        />
      </Panel>
    </>
  );
}
