import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function getRedisClient() {
  if (client) return client;

  client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  client.on("error", (err) => console.error("Redis Client Error:", err));

  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}
