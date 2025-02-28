import { tokensRepository } from "@/app/services/tokens/repository";
import pRetry from "p-retry";
import { cache } from "react";

export const tokensService = {
  getToken: cache(() =>
    pRetry(() => tokensRepository.getRuesToken({ skipCache: false }), {
      retries: 3,
    }),
  ),
  getNewToken: cache(() =>
    pRetry(() => tokensRepository.getRuesToken({ skipCache: true }), {
      retries: 3,
    }),
  ),
};
