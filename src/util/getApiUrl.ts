export const getApiUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.API_URL as string;
  } else {
    return process.env.SERVER_API_URL as string;
  }
};

export const getSocketUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.SOCKET_URL as string;
  } else {
    return process.env.SOCKET_URL as string;
  }
};
