export function visiblePoll(
  task: () => unknown,
  intervalMs: number,
): () => void {
  let timer: ReturnType<typeof setInterval> | undefined;

  const run = () => {
    Promise.resolve()
      .then(task)
      .catch((e) => console.warn(e));
  };

  const sync = () => {
    clearInterval(timer);
    timer = undefined;
    if (document.hidden) return;
    run();
    timer = setInterval(run, intervalMs);
  };

  sync();
  document.addEventListener("visibilitychange", sync);

  return () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", sync);
  };
}
