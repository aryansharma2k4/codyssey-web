import { createClient, RedisClientType } from "redis";

declare global {
  // Prevents multiple redis instances in dev due to hot reload
  var _redis: RedisClientType | undefined;
}

let client: RedisClientType;

if (!global._redis) {
  global._redis = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error("Redis reconnect failed after 10 attempts");
          return new Error("Max reconnect attempts reached");
        }
        return Math.min(retries * 100, 3000);
      },
    },
  });

  global._redis.on("error", (err) => console.error("Redis Client Error:", err));

  // connect only once
  (async () => {
    if (!global._redis!.isOpen) {
      await global._redis!.connect();
      console.log("✅ Redis connected");
    }
  })();
}

client = global._redis;

export default client;
