import { CompanyDetail } from "@/app/[company]/Components/CompanyDetail";

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
    <CompanyDetail label="Actividad Económica" direction="column">
      {economicActivities.length === 1 ? (
        <EconomicActivityItem item={economicActivities[0]} />
      ) : (
        <ol className="list-decimal pl-8">
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
    <div className="inline-flex flex-col">
      {item.description}{" "}
      <code>
        <small className="text-slate-500">CIIU {item.code}</small>
      </code>
    </div>
  );
}
