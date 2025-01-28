import { RUES } from "@mauriciorobayo/rues-api";
import Redis from "ioredis";

const tokenKey = "ruesToken";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("Missing REDIS_URL env variable.");
}
const client = new Redis(redisUrl);

export const tokenRepository = {
  async getToken({ skipCache = false }: { skipCache?: boolean } = {}) {
    if (!skipCache) {
      const storedToken = await client.get(tokenKey);
      if (storedToken) {
        return storedToken;
      }
    }

    console.log("*".repeat(500));
    const { status, data } = await RUES.getToken();

    if (status === "error") {
      throw new Error("Failed to get new RUES token");
    }

    // redis.set("foo", "bar", "EX", 20);
    await client.set(tokenKey, data.token, "EX", 5 * 24 * 60 * 60);

    return data.token;
  },
};
