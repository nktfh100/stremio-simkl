import { createClient, RedisClientType } from "redis";
import { getConfig } from "./lib/config";

let client: RedisClientType;

export async function connectToRedis() {
  console.log("Connecting to Redis...");

  const config = getConfig();

  client = createClient({
    username: config.redis.username,
    password: config.redis.password,
    socket: {
      port: config.redis.port,
      host: config.redis.host,
      reconnectStrategy: function (retries) {
        if (retries > 20) {
          console.log(
            "Too many attempts to reconnect. Redis connection was terminated",
          );
          return new Error("Too many retries.");
        } else {
          return retries * 500;
        }
      },
    },
  });

  client.on("error", (error: any) => {
    console.error("REDIS ERROR");
    console.error(error.message || error);
  });
  client.on("connect", () => console.log("Connected to Redis!"));

  client.connect();
}

export default function getClient() {
  return client;
}
