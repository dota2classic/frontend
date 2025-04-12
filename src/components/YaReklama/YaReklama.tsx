import React from "react";

export const YaReklama: React.FC = () => {
  // <!-- Yandex.RTB -->
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.yaContextCb=window.yaContextCb||[]`,
        }}
      />
      <script src="https://yandex.ru/ads/system/context.js" async></script>
    </>
  );
};
