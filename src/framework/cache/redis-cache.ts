import { ICache } from "common/interface/cache-interface";
import { getRedisClient } from "./redis-client";

export class RedisCache implements ICache {
  async get<T>(key: string): Promise<T | null> {
    const client = await getRedisClient();
    const data = await client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async set<T>(key: string, value: T, ttl = 60): Promise<boolean> {
    const client = await getRedisClient();
    await client.setEx(key, ttl, JSON.stringify(value));
    return true;
  }

  async delete(key: string): Promise<void> {
    const client = await getRedisClient();
    await client.del(key);
  }
}
