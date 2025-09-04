import React, { useRef } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useStore } from "@/store";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { GenericModal } from "@/components/GenericModal";
import { MarkdownTextarea } from "@/components/MarkdownTextarea";
import { FeedbackDto } from "@/api/back";
import { runInAction } from "mobx";
import c from "./FeedbackModal.module.scss";
import { GreedyFocusPriority, useGreedyFocus } from "@/util/useTypingCallback";
import { useTranslation } from "react-i18next";

interface IFeedbackModalProps {
  feedback: FeedbackDto;
}

export const FeedbackModal: React.FC<IFeedbackModalProps> = observer(
  ({ feedback: _feedbackInitial }) => {
    const { notify } = useStore();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    useGreedyFocus(GreedyFocusPriority.FEEDBACK_MODAL, textareaRef);

    const feedback = useLocalObservable(() => _feedbackInitial);
    const { t } = useTranslation();

    return (
      <GenericModal title={feedback.title} onClose={notify.finishFeedback}>
        <div className={c.optionGrid}>
          {feedback.options.map((option) => (
            <div key={option.id} className={c.option}>
              <Checkbox
                checked={option.checked}
                onChange={(e) => runInAction(() => (option.checked = e))}
              >
                <span>
                  {t("feedback_modal.option", { option: option.option })}
                </span>
              </Checkbox>
            </div>
          ))}
          <MarkdownTextarea
            onChange={(e) => (feedback.comment = e.target.value)}
            ref={textareaRef}
            placeholder={t("feedback_modal.yourComment")}
            className={c.comment}
          />
        </div>
        <Button
          className={c.submitButton}
          mega
          onClick={() => notify.finishFeedback(feedback)}
        >
          {t("feedback_modal.submit")}
        </Button>
      </GenericModal>
    );
  },
);
