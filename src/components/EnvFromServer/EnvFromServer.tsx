import React from "react";

export const EnvFromServer: React.FC = () => {
  const env = {
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    IS_DEV_VERSION: process.env.IS_DEV_VERSION,
  };

  // Return a JS snippet that sets window.env
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.process = { env: ${JSON.stringify(env)} };`,
      }}
    />
  );
};
