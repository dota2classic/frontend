export function detectLocale(hostname: string): "ru" | "en" {
  if (hostname && hostname.startsWith("en.")) {
    return "en";
  }
  return "ru";
}
