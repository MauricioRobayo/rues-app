import { ciiuDict } from "@/app/lib/ciiuDict";

export function parseEconomicActivities(activities: {
  ciiu1?: string;
  ciiu2?: string;
  ciiu3?: string;
  ciiu4?: string;
  descCiiu1?: string;
  descCiiu2?: string;
  descCiiu3?: string;
  descCiiu4?: string;
}) {
  const economicActivities: {
    label: string;
    code: string;
    description: string;
  }[] = [];

  if (activities.ciiu1) {
    const description = ciiuDict[activities.ciiu1];
    if (description) {
      economicActivities.push({
        label: "ciiu1",
        code: activities.ciiu1,
        description,
      });
    }
  }

  if (activities.ciiu2) {
    const description = ciiuDict[activities.ciiu2];
    if (description) {
      economicActivities.push({
        label: "ciiu2",
        code: activities.ciiu2,
        description,
      });
    }
  }

  if (activities.ciiu3) {
    const description = ciiuDict[activities.ciiu3];
    if (description) {
      economicActivities.push({
        label: "ciiu3",
        code: activities.ciiu3,
        description,
      });
    }
  }

  if (activities.ciiu4) {
    const description = ciiuDict[activities.ciiu4];
    economicActivities.push({
      label: "ciiu4",
      code: activities.ciiu4,
      description,
    });
  }

  return economicActivities;
}
