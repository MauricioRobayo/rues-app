import { companiesRepository } from "@/app/repositories/companies";
import { es } from "date-fns/locale/es";
import slugify from "@sindresorhus/slugify";
import { notFound, permanentRedirect } from "next/navigation";
import { getVerificationDigit } from "nit-verifier";
import { formatDistanceToNowStrict } from "date-fns";

export const dynamic = "force-static";
const numberFormatter = new Intl.NumberFormat("es-CO", { useGrouping: true });
const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "full",
  timeZone: "America/Bogota",
});

export default async function page({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;

  const nit = Number(company.replace(/.*-/g, ""));
  if (!nit || Number.isNaN(nit)) {
    notFound();
  }

  const companyRecord = await companiesRepository.findByNit(nit);
  if (!companyRecord) {
    notFound();
  }

  const slug = company.replace(`-${nit}`, "");
  const companySlug = slugify(companyRecord?.businessName ?? "", {
    customReplacements: [[".", ""]],
  });

  if (slug !== companySlug) {
    permanentRedirect(`/${companySlug}-${nit}`);
  }

  const dv = getVerificationDigit(nit);
  const registrationDate = dateFormatter.format(companyRecord.registrationDate);

  return (
    <article itemScope itemType="https://schema.org/Organization">
      <h1 itemProp="name">{companyRecord.businessName}</h1>
      <h2>
        NIT: {numberFormatter.format(nit)}-{dv}
      </h2>

      <section>
        <p>
          <strong>NIT:</strong> <span itemProp="taxID">{nit}</span>
        </p>
        <p>
          <strong>DV:</strong> {dv}
        </p>
        <p>
          <strong>Razón Social:</strong> {companyRecord.businessName}
        </p>
        <p>
          <strong>Activa:</strong> <span itemProp="isicV4">Sí</span>
        </p>
        <p>
          <strong>Categoría:</strong> {companyRecord.category}
        </p>
        <p>
          <strong>Organización Jurídica:</strong> {companyRecord.legalEntity}
        </p>
        <p>
          <strong>Fecha de Constitución:</strong>{" "}
          <time dateTime={companyRecord.registrationDate.toISOString()}>
            {registrationDate}
          </time>
        </p>
        <p>
          <strong>Antigüedad:</strong>{" "}
          {formatDistanceToNowStrict(companyRecord.registrationDate, {
            locale: es,
          })}
        </p>
        <p>
          <strong>Dirección:</strong>{" "}
          <span itemProp="address">{companyRecord.businessAddress}</span>
        </p>
        <p>
          <strong>Tamaño de la empresa:</strong>
          <span itemProp="numberOfEmployees">{companyRecord.companySize}</span>
        </p>
        <section>
          <h2>Actividad Económica</h2>
          <ul>
            <li>{companyRecord.economicActivity1}</li>
            <li>{companyRecord.economicActivity2}</li>
            <li>{companyRecord.economicActivity3}</li>
            <li>{companyRecord.economicActivity4}</li>
          </ul>
        </section>
      </section>
    </article>
  );
}
