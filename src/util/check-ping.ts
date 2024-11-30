import { useEffect, useState } from "react";
import { getApi } from "@/api/hooks";

// export const checkPing = (url, timeout = 6000) => {
//   return new Promise((resolve, reject) => {
//     const urlRule = new RegExp('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]');
//     if (!urlRule.test(url)) reject('invalid url');
//     try {
//       fetch(url)
//         .then(() => resolve(true))
//         .catch(() => resolve(false));
//       setTimeout(() => {
//         resolve(false);
//       }, timeout);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const checkPing = (url: string, timeout: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Timeout");
    }, timeout);

    const start = new Date().getTime();
    fetch(url, {
      mode: "no-cors",
    })
      .then(() => {
        const end = new Date().getTime();
        const latency = end - start;
        resolve(latency);
      })
      .catch(() => {
        reject("Not reachable");
      });
  });
};

export const usePing = (checkPeriod = 1000, timeout: number = 6000) => {
  const [ping, setPing] = useState<number[]>([]);
  const { data: serverList } = getApi().statsApi.useStatsControllerGetServers();

  const doCheckPing = () => {
    if (!serverList || serverList.length === 0) return;
    const url = serverList[0];
    checkPing(`http://${url}`, timeout)
      .then((measurement) => {
        setPing((pings) => {
          return pings.length === 5
            ? [...ping.slice(1), measurement]
            : [...pings, measurement];
        });
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    doCheckPing();
    const interval = setInterval(doCheckPing, checkPeriod);
    return () => clearInterval(interval);
  }, [serverList, timeout]);

  return ping.length === 0
    ? undefined
    : Math.round(ping.reduce((a, b) => a + b, 0) / ping.length);
};
