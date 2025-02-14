import slugify from "@sindresorhus/slugify";

export function slugifyCompanyName(companyName: string) {
  return slugify(companyName, {
    customReplacements: [[".", ""]],
  });
}
