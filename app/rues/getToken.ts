import { tokenRepository } from "@/app/db/tokens";
import { RUES } from "@mauriciorobayo/rues-api";

export async function getToken() {
  const storedToken = await tokenRepository.getLast();

  if (storedToken) {
    console.log("Returning stored token.");
    return storedToken;
  }

  console.log("Getting new token.");
  const { status, data } = await RUES.getToken();

  if (status === "error") {
    throw new Error("Failed to get new RUES token");
  }

  await tokenRepository.insert(data.token);

  return data.token;
}
