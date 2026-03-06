import {
  faro as faroInstance,
  getWebInstrumentations,
  initializeFaro,
  LogLevel,
} from "@grafana/faro-web-sdk";

let initialized = false;

export function initFaro() {
  if (initialized || typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") return;
  initialized = true;

  const faroApp = initializeFaro({
    // TODO: make this a process.env variable
    url: "https://logsink.dotaclassic.ru/collect",
    app: {
      name: "d2c-new",
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? "unknown",
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: false,
        enablePerformanceInstrumentation: false,
      }),
    ],
  });

  faroApp.api.pushLog(["Faro initialized"], { level: LogLevel.INFO });
}

export function pushFaroEvent(
  name: string,
  attributes?: Record<string, string>,
) {
  try {
    faroInstance.api.pushEvent(name, attributes);
  } catch {
    // faro not initialized yet
  }
}

export function setFaroUser(steamId: string | undefined) {
  try {
    faroInstance.api.setUser(steamId ? { id: steamId } : undefined);
  } catch {
    // faro not initialized yet
  }
}

export function logError(error: unknown, context?: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    const err = error instanceof Error ? error : new Error(String(error));
    faroInstance.api.pushError(err, { context });
  } catch {
    // faro not initialized yet
  }
}
