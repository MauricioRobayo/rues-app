import {
  OpenDataEstablishment,
  type OpenDataCompany,
} from "@/app/services/openData/types";

const openDataSet = {
  companies: {
    id: "c82u-588k",
    fields: [
      "codigo_camara",
      "camara_comercio",
      "matricula",
      "inscripcion_proponente",
      "razon_social",
      "primer_apellido",
      "segundo_apellido",
      "primer_nombre",
      "segundo_nombre",
      "sigla",
      "codigo_clase_identificacion",
      "clase_identificacion",
      "numero_identificacion",
      "nit",
      "digito_verificacion",
      "cod_ciiu_act_econ_pri",
      "cod_ciiu_act_econ_sec",
      "ciiu3",
      "ciiu4",
      "fecha_matricula",
      "fecha_renovacion",
      "ultimo_ano_renovado",
      "fecha_vigencia",
      "fecha_cancelacion",
      "codigo_tipo_sociedad",
      "tipo_sociedad",
      "codigo_organizacion_juridica",
      "organizacion_juridica",
      "codigo_categoria_matricula",
      "categoria_matricula",
      "codigo_estado_matricula",
      "estado_matricula",
      "clase_identificacion_rl",
      "num_identificacion_representante_legal",
      "representante_legal",
      "fecha_actualizacion",
    ],
  },
  establishments: {
    id: "nb3d-v3n7",
    fields: [
      "codigo_camara",
      "camara_comercio",
      "matricula",
      "ultimo_ano_renovado",
      "fecha_renovacion",
      "razon_social",
      "codigo_estado_matricula",
      "estado_matricula",
      "cod_ciiu_act_econ_pri",
      "cod_ciiu_act_econ_sec",
      "ciiu3",
      "ciiu4",
      "fecha_cancelacion",
      "codigo_clase_identificacion",
      "clase_identificacion",
      "numero_identificacion",
      "nit_propietario",
      "digito_verificacion",
      "codigo_camara_propietario",
      "camara_comercio_propitario",
      "matr_cula_propietario",
      "codigo_tipo_propietario",
      "tipo_propietario",
      "categoria_matricula",
    ],
  },
};

export const openDataApi = {
  getCompanyByNit(nit: string, { signal }: { signal?: AbortSignal } = {}) {
    return datosAbiertosFetch<OpenDataCompany[]>({
      dataSetId: openDataSet.companies.id,
      query: new URLSearchParams({
        numero_identificacion: nit,
        $select: openDataSet.companies.fields.join(","),
      }),
      signal,
    });
  },
  getEstablishments(
    {
      registrationNumber,
      chamberCode,
    }: {
      registrationNumber: string;
      chamberCode: string;
    },
    { signal }: { signal?: AbortSignal } = {},
  ) {
    return datosAbiertosFetch<OpenDataEstablishment[]>({
      dataSetId: openDataSet.establishments.id,
      query: new URLSearchParams({
        matr_cula_propietario: registrationNumber,
        codigo_camara_propietario: chamberCode,
        $select: openDataSet.establishments.fields.join(","),
      }),
      signal,
    });
  },
};

async function datosAbiertosFetch<T>({
  dataSetId,
  query,
  signal,
}: {
  dataSetId: string;
  query: URLSearchParams;
  signal?: AbortSignal;
}): Promise<
  | {
      status: "success";
      data: T;
      code: number;
      error?: never;
    }
  | {
      status: "error";
      data?: never;
      code?: number;
      error?: unknown;
    }
> {
  const token = process.env.DATOS_ABIERTOS_TOKEN;

  if (!token) {
    throw new Error("Missing DATOS_ABIERTOS_TOKEN");
  }

  const headers = new Headers();
  headers.append("X-App-Token", token);

  const url = new URL(
    `/resource/${dataSetId}.json`,
    "https://www.datos.gov.co",
  );
  url.search = query.toString();

  try {
    const response = await fetch(url, {
      headers,
      redirect: "follow",
      signal,
    });

    if (!response.ok) {
      console.error(`Failed to fetch Datos Abiertos ${dataSetId}`);
      return {
        status: "error",
        code: response.status,
      };
    }

    const data: T = await response.json();
    return {
      status: "success",
      code: response.status,
      data,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}
