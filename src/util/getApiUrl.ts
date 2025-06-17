export const getApiUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.API_URL;
  } else {
    return process.env.SERVER_API_URL;
  }
};

export const getSocketUrl = () => {
  if (typeof window !== "undefined") {
    return window.SOCKET_URL;
  } else {
    return process.env.SOCKET_URL;
  }
};
