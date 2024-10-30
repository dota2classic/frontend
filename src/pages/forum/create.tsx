import { Button, Input, MarkdownTextarea } from "@/components";
import React, { useCallback, useState } from "react";
import c from "@/components/Thread/Thread.module.scss";
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
    <div className={c.createThread}>
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
        onChange={(e) => {
          setContent(e.target.value!);
        }}
      />
      <br />
      <br />
      <div className={c.createMessage}>
        <Button onClick={createThread}>Создать тему</Button>
      </div>
    </div>
  );
}
