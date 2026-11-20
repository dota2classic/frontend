export function visiblePoll(
  task: () => unknown,
  intervalMs: number,
  { runOnStart = true }: { runOnStart?: boolean } = {},
): () => void {
  let timer: ReturnType<typeof setInterval> | undefined;

  const run = () => {
    Promise.resolve()
      .then(task)
      .catch((e) => console.warn(e));
  };

  const schedule = (runNow: boolean) => {
    clearInterval(timer);
    timer = undefined;
    if (document.hidden) return;
    if (runNow) run();
    timer = setInterval(run, intervalMs);
  };

  const sync = () => schedule(true);

  schedule(runOnStart);
  document.addEventListener("visibilitychange", sync);

  return () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", sync);
  };
}
