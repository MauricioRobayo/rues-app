import { getBidderFiles } from "@/app/services/ccb/api";
import { tokensRepository } from "@/app/services/tokens/repository";

export const ccbService = {
  async getBidderFiles(bidderId: string) {
    try {
      const token = await tokensRepository.getCcbToken();
      const filesResponse = await getBidderFiles({
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
