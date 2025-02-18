import { getBidderRecords } from "@/app/services/ccb/api";
import { tokensRepository } from "@/app/services/tokens/repository";
import type { BidderRecordDto } from "@/app/types/BidderDto";

export const ccbService = {
  async getBidderRecords(bidderId: string): Promise<BidderRecordDto[] | null> {
    try {
      const token = await tokensRepository.getCcbToken();
      const filesResponse = await getBidderRecords({
        bidderId,
        token,
      });
      if (filesResponse.status === "error") {
        console.log("getBiddersFiles failed", bidderId);
        return null;
      }

      return filesResponse.data.map((file) => ({
        date: file.fechaActo,
        type: file.tipoActo,
        id: file.id,
        record: file.registro,
      }));
    } catch (err) {
      console.error("ccbService.getBidderFiles failed", err);
      return null;
    }
  },
};
