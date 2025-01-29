import React, { useCallback } from "react";
import { FeedbackTemplateDto, FeedbackTemplateOptionDto } from "@/api/back";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Button, Input, Panel } from "@/components";
import { runInAction } from "mobx";
import c from "./EditFeedbackTemplate.module.scss";
import { getApi } from "@/api/hooks";
import { useRouter } from "next/router";
import { Rubik } from "next/font/google";
import cx from "clsx";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface IEditFeedbackTemplateProps {
  template?: FeedbackTemplateDto;
}

export const EditFeedbackTemplate: React.FC<IEditFeedbackTemplateProps> =
  observer(({ template }) => {
    const temp = useLocalObservable<{
      template: FeedbackTemplateDto;
      lastReceivedTemplate: FeedbackTemplateDto;
      updateTemplate: (t: FeedbackTemplateDto) => void;
    }>(() => ({
      template: template || {
        id: -1,
        tag: "",
        title: "",
        options: [],
      },
      lastReceivedTemplate: template || {
        id: -1,
        tag: "",
        title: "",
        options: [],
      },
      updateTemplate(template: FeedbackTemplateDto) {
        runInAction(() => {
          this.lastReceivedTemplate = template;
          this.template = template;
        });
      },
    }));

    const router = useRouter();

    const addOption = useCallback(() => {
      if (!template) return;
      getApi()
        .adminFeedback.adminFeedbackControllerCreateOption(template.id, {
          option: Math.random().toString(),
        })
        .then((it) => temp.updateTemplate(it));
    }, [temp, template]);

    const removeOption = useCallback(
      async (id: number) => {
        if (!template) return;
        await getApi()
          .adminFeedback.adminFeedbackControllerDeleteOption(template.id, id)
          .then((it) => temp.updateTemplate(it));
      },
      [temp, template],
    );

    const updateOption = useCallback(
      async (option: FeedbackTemplateOptionDto) => {
        if (!template) return;
        await getApi()
          .adminFeedback.adminFeedbackControllerEditOption(
            template.id,
            option.id,
            { option: option.option },
          )
          .then((it) => temp.updateTemplate(it));
      },
      [temp, template],
    );

    const updateTemplate = useCallback(async () => {
      if (template) {
        // update
        await getApi()
          .adminFeedback.adminFeedbackControllerUpdateFeedback(
            template.id,
            temp.template,
          )
          .then((it) => {
            temp.updateTemplate(it);

            if (it.id !== template.id) {
              router.replace(
                `/admin/feedback/edit/[id]`,
                `/admin/feedback/edit/${it.id}`,
              );
            }
          });
      } else {
        // create
        await getApi()
          .adminFeedback.adminFeedbackControllerCreateFeedback(temp.template)
          .then((feedback) =>
            router.replace(
              `/admin/feedback/edit/[id]`,
              `/admin/feedback/edit/${feedback.id}`,
            ),
          );
      }
    }, [router, temp, template]);
    return (
      <Panel className={cx(c.form, threadFont.className)}>
        <h3>Тег(техническая инфа)</h3>
        <Input
          value={temp.template.tag}
          placeholder="Тег"
          onChange={(e) =>
            runInAction(() => (temp.template.tag = e.target.value))
          }
        />
        <h3>Заголовок</h3>
        <Input
          value={temp.template.title}
          placeholder="Заголовок"
          onChange={(e) =>
            runInAction(() => (temp.template.title = e.target.value))
          }
        />

        <h3>Варианты ответа</h3>
        <div className={c.options}>
          {temp.template.options
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((option) => {
              const dirty =
                temp.lastReceivedTemplate.options.find(
                  (t) => t.id === option.id,
                )?.option !== option.option;
              return (
                <div key={option.id} className={c.feedbackOption}>
                  <Input
                    value={option.option}
                    onChange={(e) => {
                      runInAction(() => (option.option = e.target.value));
                    }}
                    placeholder="Вариант ответа"
                  />
                  <Button
                    onClick={() => updateOption(option)}
                    className={c.save}
                    disabled={!dirty}
                  >
                    Сохранить
                  </Button>
                  <Button
                    onClick={() => removeOption(option.id)}
                    className={c.delete}
                  >
                    Удалить
                  </Button>
                </div>
              );
            })}
          <Button
            className={c.compact}
            disabled={!template}
            onClick={addOption}
          >
            Добавить вариант ответа
          </Button>
        </div>

        <Button onClick={updateTemplate}>Сохранить</Button>
      </Panel>
    );
  });
