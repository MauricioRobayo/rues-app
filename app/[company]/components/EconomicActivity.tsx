import { CompanyDetail } from "@/app/[company]/components/CompanyDetail";

export function EconomicActivity({
  economicActivities,
}: {
  economicActivities: { code: string; description: string }[];
}) {
  if (economicActivities.length === 1) {
    return (
      <CompanyDetail label="Actividad Económica">
        <EconomicActivityItem item={economicActivities[0]} />
      </CompanyDetail>
    );
  }
  return (
    <CompanyDetail label="Actividad Económica">
      {economicActivities.length === 1 ? (
        <EconomicActivityItem item={economicActivities[0]} />
      ) : (
        <ol className="flex list-decimal flex-col gap-2 pl-4">
          {economicActivities.map((economicActivity) => (
            <li key={economicActivity.code} className="">
              <EconomicActivityItem item={economicActivity} />
            </li>
          ))}
        </ol>
      )}
    </CompanyDetail>
  );
}

function EconomicActivityItem({
  item,
}: {
  item: { code: string; description: string };
}) {
  return (
    <div className="inline-flex flex-col leading-tight">
      {item.description}
      <code>
        <small className="text-slate-500">CIIU {item.code}</small>
      </code>
    </div>
  );
}
