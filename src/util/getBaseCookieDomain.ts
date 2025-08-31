export function getBaseCookieDomain() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname.startsWith("en.")) {
      // we want prepend en to domain
      return hostname.replace("en.", ``);
    } else {
      return hostname;
    }
  }
}

export function getBaseDomain() {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
}
