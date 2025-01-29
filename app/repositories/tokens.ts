import { getToken } from "@mauriciorobayo/rues-api";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const tokenKey = "token";

export const tokenRepository = {
  async getToken({ skipCache = false }: { skipCache?: boolean } = {}) {
    if (!skipCache) {
      const storedToken = await redis.get<string>(tokenKey);
      if (storedToken) {
        return storedToken;
      }
    }

    const { status, data } = await getToken();

    if (status === "error") {
      throw new Error("Failed to get new RUES token");
    }

    await redis.set(tokenKey, data.token, { ex: 7 * 24 * 60 * 60 });

    return data.token;
  },
};
