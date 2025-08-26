import React, { useCallback } from "react";
import { FeedbackTemplateDto, FeedbackTemplateOptionDto } from "@/api/back";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Button, Checkbox, Input, Panel } from "@/components";
import { runInAction } from "mobx";
import c from "./EditFeedbackTemplate.module.scss";
import { getApi } from "@/api/hooks";
import { useRouter } from "next/router";
import { Rubik } from "next/font/google";
import cx from "clsx";
import { useTranslation } from "react-i18next";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface IEditFeedbackTemplateProps {
  template?: FeedbackTemplateDto;
}

export const EditFeedbackTemplate: React.FC<IEditFeedbackTemplateProps> =
  observer(({ template }) => {
    const { t } = useTranslation();
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
        needsTicket: false,
      },
      lastReceivedTemplate: template || {
        id: -1,
        tag: "",
        title: "",
        options: [],
        needsTicket: false,
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
          .adminFeedback.adminFeedbackControllerUpdateFeedback(template.id, {
            createTicket: temp.template.needsTicket,
            tag: temp.template.tag,
            title: temp.template.title,
          })
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
        <h3>{t("edit_feedback_template.tagInfo")}</h3>
        <Input
          value={temp.template.tag}
          placeholder={t("edit_feedback_template.tagPlaceholder")}
          onChange={(e) =>
            runInAction(() => (temp.template.tag = e.target.value))
          }
        />
        <h3>{t("edit_feedback_template.title")}</h3>
        <Input
          value={temp.template.title}
          placeholder={t("edit_feedback_template.titlePlaceholder")}
          onChange={(e) =>
            runInAction(() => (temp.template.title = e.target.value))
          }
        />

        <Checkbox
          checked={temp.template.needsTicket}
          onChange={(v) => {
            runInAction(() => (temp.template.needsTicket = v));
          }}
        >
          {t("edit_feedback_template.createTicket")}
        </Checkbox>

        <h3>{t("edit_feedback_template.responseOptions")}</h3>
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
                    placeholder={t("edit_feedback_template.optionPlaceholder")}
                  />
                  <Button
                    onClick={() => updateOption(option)}
                    className={c.save}
                    disabled={!dirty}
                  >
                    {t("edit_feedback_template.save")}
                  </Button>
                  <Button
                    onClick={() => removeOption(option.id)}
                    className={c.delete}
                  >
                    {t("edit_feedback_template.delete")}
                  </Button>
                </div>
              );
            })}
          <Button
            className={c.compact}
            disabled={!template}
            onClick={addOption}
          >
            {t("edit_feedback_template.addResponse")}
          </Button>
        </div>

        <Button onClick={updateTemplate}>
          {t("edit_feedback_template.save")}
        </Button>
      </Panel>
    );
  });
