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
  if (queue.isSearchingServer) return QueueGameState.SEARCHING_SERVER;
  else if (queue.gameInfo?.serverURL) return QueueGameState.SERVER_READY;
  else if (!queue.gameInfo) return QueueGameState.NO_GAME;
  else if (!queue.gameInfo.iAccepted)
    return QueueGameState.READY_CHECK_WAITING_USER;
  else return QueueGameState.READY_CHECK_WAITING_OTHER;
};
