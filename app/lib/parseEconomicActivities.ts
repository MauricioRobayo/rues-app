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
    description?: string;
  }[] = [];

  if (activities.ciiu1) {
    economicActivities.push({
      label: "ciiu1",
      code: activities.ciiu1,
      description: activities.descCiiu1,
    });
  }

  if (activities.ciiu2) {
    economicActivities.push({
      label: "ciiu2",
      code: activities.ciiu2,
      description: activities.descCiiu2,
    });
  }

  if (activities.ciiu3) {
    economicActivities.push({
      label: "ciiu3",
      code: activities.ciiu3,
      description: activities.descCiiu3,
    });
  }

  if (activities.ciiu4) {
    economicActivities.push({
      label: "ciiu4",
      code: activities.ciiu4,
      description: activities.descCiiu4,
    });
  }

  return economicActivities;
}
