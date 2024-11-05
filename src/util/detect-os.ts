export enum OperatingSystem {
  MAC_OS = "macos",
  IOS = "ios",
  WINDOWS = "windows",
  ANDROID = "android",
  LINUX = "linux",
}

export function getOSFromHeader(
  userAgent: string,
  platform?: string,
): OperatingSystem {
  const macosPlatforms = ["macOS", "Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"];
  let os: OperatingSystem = OperatingSystem.WINDOWS;

  if (!platform) {
    if (macosPlatforms.findIndex((t) => userAgent.includes(t)) !== -1)
      return OperatingSystem.MAC_OS;
    else if (windowsPlatforms.findIndex((t) => userAgent.includes(t)) !== -1)
      return OperatingSystem.WINDOWS;
    else if (userAgent.includes("linux")) return OperatingSystem.LINUX;

    return OperatingSystem.WINDOWS;
  }

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = OperatingSystem.MAC_OS;
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = OperatingSystem.IOS;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = OperatingSystem.WINDOWS;
  } else if (/Android/.test(userAgent)) {
    os = OperatingSystem.ANDROID;
  } else if (/Linux/.test(platform)) {
    os = OperatingSystem.LINUX;
  }

  return os;
}
export function getOS(): OperatingSystem {
  if (typeof window === "undefined") {
  }

  const userAgent = window.navigator.userAgent;
  return getOSFromHeader(userAgent, window.navigator.platform);
}
