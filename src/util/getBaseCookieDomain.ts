export function getBaseCookieDomain() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname.startsWith("en.")) {
      // we want prepend en to domain
      return "." + hostname.replace(hostname, `en.${hostname}`);
    } else {
      return "." + hostname;
    }
  }
}
