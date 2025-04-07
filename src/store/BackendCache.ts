import Keyv from "keyv";

import KeyvRedis from "@keyv/redis";

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_USER = process.env.REDIS_USER;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const BackendCache = new Keyv(
  new KeyvRedis({
    url: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:6379`,
    username: REDIS_USER,
    password: REDIS_PASSWORD,
    socket: {
      host: REDIS_HOST,
      port: 6379,
      reconnectStrategy: (retries) => Math.min(retries * 100, 2000), // Custom reconnect logic
    },
  }),
);
