import { ciiuDict } from "@/app/lib/ciiuDict";

export interface EconomicActivity {
  label: string;
  code: string;
  description: string;
}

export function parseEconomicActivities(activities: {
  ciiu1?: string;
  ciiu2?: string;
  ciiu3?: string;
  ciiu4?: string;
}) {
  const economicActivities = new Map<string, EconomicActivity>();

  if (activities.ciiu1) {
    const description = ciiuDict[activities.ciiu1];
    if (description) {
      economicActivities.set(activities.ciiu1, {
        label: "ciiu1",
        code: activities.ciiu1,
        description,
      });
    }
  }

  if (activities.ciiu2) {
    const description = ciiuDict[activities.ciiu2];
    if (description) {
      economicActivities.set(activities.ciiu2, {
        label: "ciiu2",
        code: activities.ciiu2,
        description,
      });
    }
  }

  if (activities.ciiu3) {
    const description = ciiuDict[activities.ciiu3];
    if (description) {
      economicActivities.set(activities.ciiu3, {
        label: "ciiu3",
        code: activities.ciiu3,
        description,
      });
    }
  }

  if (activities.ciiu4) {
    const description = ciiuDict[activities.ciiu4];
    economicActivities.set(activities.ciiu4, {
      label: "ciiu4",
      code: activities.ciiu4,
      description,
    });
  }

  return Array.from(economicActivities.values());
}
