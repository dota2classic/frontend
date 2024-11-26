import { useStore } from "@/store";

export enum QueueGameState {
  SEARCHING_SERVER,
  SERVER_READY,
  NO_GAME,
  READY_CHECK_WAITING_USER,
  READY_CHECK_WAITING_OTHER,
}

export const useQueueState = (): QueueGameState => {
  const { queue } = useStore();

  if (queue.gameState) return QueueGameState.SERVER_READY;
  else if (queue.roomState) {
    if (!queue.iAccepted) return QueueGameState.READY_CHECK_WAITING_USER;
    else return QueueGameState.READY_CHECK_WAITING_OTHER;
  } else if (queue.serverSearching) return QueueGameState.SEARCHING_SERVER;

  return QueueGameState.NO_GAME;
};
