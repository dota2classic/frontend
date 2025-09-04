import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { FeedbackModal } from "./FeedbackModal";

export const FeedbackModalContainer = observer(() => {
  const { notify } = useStore();
  const feedback = notify.currentFeedback;

  if (!feedback) return null;

  return <FeedbackModal feedback={feedback} />;
});
