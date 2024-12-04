import c from "@/components/Message/Message.module.scss";
import { MdDelete, MdVolumeMute } from "react-icons/md";

interface MessageControlsProps {
  onMute?: () => void;
  onDelete?: () => void;
}

export const MessageControls = ({ onDelete, onMute }: MessageControlsProps) => {
  const isDeletable = !!onDelete;

  return (
    <div className={c.controls}>
      {isDeletable && <MdDelete className={c.delete} onClick={onDelete} />}
      {isDeletable && <MdVolumeMute className={c.delete} onClick={onMute} />}
    </div>
  );
};
