import { COMPANY_REVALIDATION_TIME } from "@/app/lib/constants";
import { ccbService } from "@/app/services/ccb/service";
import { Code, Flex, Text } from "@radix-ui/themes";
import { unstable_cache } from "next/cache";

export async function BidderRecords({ bidderId }: { bidderId: string }) {
  const records = await getBidderFilesCached(bidderId);

  if (!records || records.length === 0) {
    return null;
  }

  return (
    <ul>
      {records.map((record) => (
        <li key={record.id}>
          <Flex align="center" asChild gap="2">
            <Text size="2">
              <Code variant="ghost" color="gray">
                {record.date}
              </Code>
              {record.type}
            </Text>
          </Flex>
        </li>
      ))}
    </ul>
  );
}

const getBidderFilesCached = unstable_cache(
  ccbService.getBidderFiles,
  undefined,
  {
    revalidate: COMPANY_REVALIDATION_TIME,
  },
);
