import { BidderRecords } from "@/app/[company]/components/Bidder/BidderRecords";
import { CopyButton } from "@/app/[company]/components/CopyButton";
import { COMPANY_REVALIDATION_TIME } from "@/app/lib/constants";
import { ccbService } from "@/app/services/ccb/service";
import { Code, Flex, Spinner } from "@radix-ui/themes";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";

export async function Bidder({ bidderId }: { bidderId: string }) {
  const records = await getBidderFilesCached(bidderId);

  return (
    <Flex direction="column" gap="2">
      <Flex gap="2" align="center">
        <Code variant="ghost">{bidderId}</Code>
        <CopyButton value={bidderId} />
      </Flex>
      <Suspense fallback={<Spinner />}>
        <BidderRecords records={records} bidderId={bidderId} />
      </Suspense>
    </Flex>
  );
}

const getBidderFilesCached = (bidderId: string) => {
  const tag = bidderId;
  return unstable_cache(() => ccbService.getBidderRecords(bidderId), [tag], {
    revalidate: COMPANY_REVALIDATION_TIME,
    tags: [tag],
  })();
};
