import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { ReportModal } from "@/containers";

export const ReportModalContainer = observer(() => {
  const { report } = useStore();

  if (!report.reportMeta) return null;

  return <ReportModal onClose={report.clear} meta={report.reportMeta} />;
});
