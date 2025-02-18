import { chambersRepository } from "@/app/services/chambers/repository";
import pRetry from "p-retry";

export async function getChamber(code: string) {
  try {
    const chamber = await pRetry(
      () =>
        chambersRepository.findChamberByCode(code, [
          "name",
          "address",
          "city",
          "state",
          "certificateUrl",
          "url",
          "email",
          "phoneNumber",
        ]),
      {
        retries: 3,
      },
    );
    return chamber ?? null;
  } catch (err) {
    console.error("Failed to retrieve chamber:", code, err);
    return null;
  }
}
