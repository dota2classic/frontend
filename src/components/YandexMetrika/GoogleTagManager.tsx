export const GoogleTagManager = () => {
  const tagId = "G-WWX8ZSPTTC";
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${tagId}');`,
        }}
      />
    </>
  );
};
