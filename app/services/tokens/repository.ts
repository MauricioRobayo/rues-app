import { getToken as getCcbToken } from "@/app/services/ccb/api";
import { getTokenWithPassword } from "@mauriciorobayo/rues-api";
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

    const tokenResponse = await getTokenWithPassword({
      username: process.env.RUES_USERNAME ?? "",
      password: process.env.RUES_PASSWORD ?? "",
    });

    if (tokenResponse.status === "error") {
      throw new Error("Failed to get new RUES token");
    }

    await redis.set(tokenKey.rues, tokenResponse.data.access_token, {
      ex: tokenResponse.data.expires_in - 60 * 60,
    });

    return tokenResponse.data.access_token;
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
