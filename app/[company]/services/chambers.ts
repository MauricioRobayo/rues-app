import { companiesRepository } from "@/app/repositories/companies";
import pRetry from "p-retry";

export async function getChamber(code: number) {
  try {
    const chamber = await pRetry(
      () => companiesRepository.findChamberByCode(code),
      {
        retries: 3,
      },
    );
    if (!chamber) {
      return null;
    }
    return [
      { label: "Nombre", value: chamber.name },
      { label: "Dirección", value: chamber.address },
      { label: "Ciudad", value: chamber.city },
      { label: "Departamento", value: chamber.state },
    ];
  } catch (err) {
    console.error("Failed to retrieve chamber:", code, err);
    return null;
  }
}
