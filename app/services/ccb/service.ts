import { getBidderRecords } from "@/app/services/ccb/api";
import { tokensRepository } from "@/app/services/tokens/repository";
import type { BidderRecordDto } from "@/app/types/BidderDto";

export const ccbService = {
  async getBidderRecords(
    bidderId: string,
  ): Promise<
    | { status: "success"; records: BidderRecordDto[] }
    | { status: "error"; error?: unknown }
  > {
    try {
      const token = await tokensRepository.getCcbToken();
      const filesResponse = await getBidderRecords({
        bidderId,
        token,
      });
      if (filesResponse.status === "error") {
        console.log("getBiddersFiles failed", bidderId);
        return {
          status: "error",
          error: filesResponse.error,
        };
      }

      return {
        status: "success",
        records: filesResponse.data.map((file) => ({
          date: file.fechaActo,
          type: file.tipoActo,
          id: file.id,
          record: file.registro,
        })),
      };
    } catch (error) {
      console.error("ccbService.getBidderFiles failed", error);
      return {
        status: "error",
        error,
      };
    }
  },
};
