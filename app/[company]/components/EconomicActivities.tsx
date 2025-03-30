import { DataList, Code, Link } from "@radix-ui/themes";

export function EconomicActivities({
  activities,
}: {
  activities: { label: string; code: string; description: string }[];
}) {
  return (
    <ol>
      {activities.map((item) => (
        <li key={item.label}>
          <Link href={`https://www.ciiu.co/${item.code}`}>
            <DataList.Root orientation="horizontal">
              <DataList.Item>
                <DataList.Label minWidth="0">
                  <Code>{item.code}</Code>
                </DataList.Label>
                <DataList.Value>{item.description}</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Link>
        </li>
      ))}
    </ol>
  );
}
