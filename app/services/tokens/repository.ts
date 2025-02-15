import { getToken as getCcbToken } from "@/app/services/ccb/api";
import { getToken as getRuesToken } from "@mauriciorobayo/rues-api";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const tokenKey = {
  rues: "rues-token",
  ccb: "ccb-token",
};

export const tokensRepository = {
  async getRuesToken({ skipCache = false }: { skipCache?: boolean } = {}) {
    if (!skipCache) {
      const storedToken = await redis.get<string>(tokenKey.rues);
      if (storedToken) {
        return storedToken;
      }
    }

    const { status, data } = await getRuesToken();

    if (status === "error") {
      throw new Error("Failed to get new RUES token");
    }

    await redis.set(tokenKey.rues, data.token, { ex: 7 * 24 * 60 * 60 });

    return data.token;
  },
  async getCcbToken({ skipCache = false }: { skipCache?: boolean } = {}) {
    if (!skipCache) {
      const storedToken = await redis.get<string>(tokenKey.ccb);
      if (storedToken) {
        return storedToken;
      }
    }

    const response = await getCcbToken();

    if (response.status === "error") {
      throw new Error("Failed to get new CCB token");
    }

    await redis.set(tokenKey.ccb, response.data.access_token, {
      ex: response.data.expires_in - 60,
    });

    return response.data.access_token;
  },
};
