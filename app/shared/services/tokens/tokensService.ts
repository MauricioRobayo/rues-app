import { tokensRepository } from "@/app/repositories/tokens";
import pRetry from "p-retry";
import { cache } from "react";

export const tokensService = {
  getToken: cache(() =>
    pRetry(() => tokensRepository.getToken({ skipCache: false }), {
      retries: 3,
    }),
  ),
  getNewToken: cache(() =>
    pRetry(() => tokensRepository.getToken({ skipCache: true }), {
      retries: 3,
    }),
  ),
};
