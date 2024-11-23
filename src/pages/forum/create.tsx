import {
  Button,
  EmbedProps,
  Input,
  MarkdownTextarea,
  Panel,
} from "@/components";
import React, { useCallback, useState } from "react";
import c from "./Forum.module.scss";
import { getApi } from "@/api/hooks";
import { useRouter } from "next/router";

export default function CreateThreadPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const createThread = useCallback(() => {
    getApi()
      .forumApi.forumControllerCreateThread({
        content,
        title,
      })
      .then((res) => router.push(`/forum/[id]`, `/forum/${res.externalId}`));
  }, [content, title, router]);

  return (
    <Panel className={c.createThread}>
      <EmbedProps
        title="Создать тему на форуме"
        description="Создать новую тему на форуме. Обсудить насущные вопросы"
      />
      <h3>Название топика</h3>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={"Гена опять запотел в паблике"}
      />
      <h3>Сообщение</h3>
      <MarkdownTextarea
        className={c.text}
        placeholder={"Введите сообщение"}
        value={content}
        rows={8}
        onChange={(e) => {
          setContent(e.target.value!);
        }}
      />
      <br />
      <br />
      {/*<div className={c.createMessage}>*/}
      <Button mega onClick={createThread}>
        Создать тему
      </Button>
      {/*</div>*/}
    </Panel>
  );
}
