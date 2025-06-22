import React, { useRef, useEffect } from 'react';
import c from './Wiki.module.scss';

//ни в коем случае не ставить в конце слэш
const CHILD_ORIGIN = "https://wiki.dotaclassic.ru";

export default function WikiEmbed() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== CHILD_ORIGIN) return;

      const data = event.data as { type: string };
      if (data.type === 'setHeight' && typeof (event.data as any).height === 'number') {
        iframeRef.current!.style.height = `${(event.data as any).height}px`;
      }
      else if (data.type === 'scrollToTopDefault') {
        iframeRef.current!.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      // else if (data.type === 'scrollToTopSmooth') {
      //   setTimeout(() => {
      //     iframeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start'});
      //   }, 25);
      // }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={CHILD_ORIGIN}
      className={c.iframe}
    />
  );
}