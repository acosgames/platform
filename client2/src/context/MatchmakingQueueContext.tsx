import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type QueuePayload = {
  gameId: string;
  gameName: string;
};

type QueueState = {
  active: boolean;
  gameId: string;
  gameName: string;
  queuedAt: number;
  etaSeconds: number;
};

type MatchmakingQueueContextValue = {
  queue: QueueState;
  enqueue: (payload: QueuePayload) => void;
  cancelQueue: () => void;
};

const QUEUE_STORAGE_KEY = "acos-matchmaking-queue";

const initialQueueState: QueueState = {
  active: false,
  gameId: "",
  gameName: "",
  queuedAt: 0,
  etaSeconds: 0,
};

const MatchmakingQueueContext = createContext<MatchmakingQueueContextValue | null>(null);

export function MatchmakingQueueProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<QueueState>(() => {
    if (typeof window === "undefined") return initialQueueState;

    const stored = window.localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!stored) return initialQueueState;

    try {
      const parsed = JSON.parse(stored) as QueueState;
      if (!parsed || typeof parsed !== "object") return initialQueueState;
      return {
        active: Boolean(parsed.active),
        gameId: parsed.gameId ?? "",
        gameName: parsed.gameName ?? "",
        queuedAt: parsed.queuedAt ?? 0,
        etaSeconds: parsed.etaSeconds ?? 0,
      };
    } catch {
      return initialQueueState;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  }, [queue]);

  const enqueue = (payload: QueuePayload) => {
    const etaSeconds = 45 + Math.floor(Math.random() * 80);
    setQueue({
      active: true,
      gameId: payload.gameId,
      gameName: payload.gameName,
      queuedAt: Date.now(),
      etaSeconds,
    });
  };

  const cancelQueue = () => {
    setQueue(initialQueueState);
  };

  const value = useMemo(
    () => ({
      queue,
      enqueue,
      cancelQueue,
    }),
    [queue],
  );

  return <MatchmakingQueueContext.Provider value={value}>{children}</MatchmakingQueueContext.Provider>;
}

export function useMatchmakingQueue() {
  const context = useContext(MatchmakingQueueContext);
  if (!context) {
    throw new Error("useMatchmakingQueue must be used within MatchmakingQueueProvider");
  }
  return context;
}
