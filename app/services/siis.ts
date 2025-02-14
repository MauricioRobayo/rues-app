import pRetry from "p-retry";

export interface SiisResponse {
  _shards: Shards;
  hits: Hits;
  took: number;
  timed_out: boolean;
}

export interface Shards {
  total: number;
  failed: number;
  successful: number;
  skipped: number;
}

export interface Hits {
  hits: Hit[];
  total: Total;
  max_score: null;
}

export interface Hit {
  _index: string;
  _type: string;
  _source: SiisData;
  _id: string;
  sort: number[];
  _score: null;
}

export interface SiisData {
  // Only using this fields atm
  region: string;
  ciudad: string;
  departamento: string;
  macroSector: string;
  sector: string;
  // estado: string;
  // financieros: Financieros;
  // infoEmpresa: InfoEmpresa;
  // fechaEstado: Date;
  // nombreEmpresa: string;
  // actividadesEconomicas: string[];
  // geolocalizacion: Geolocalizacion;
  // fechaCorte: Date;
  // NIT: string;
  // fechaConstitucion: Date;
  // puntoEntrada: string;
}

// export interface Financieros {
//   ingresosEmpresa: number;
//   roeAnterior: number;
//   roaAnterior: number;
//   activos: number;
//   roa: number;
//   utilidades: number;
//   ros: number;
//   roe: number;
//   margen: number;
// }

// export interface Geolocalizacion {
//   latitud: string;
//   longitud: string;
//   direccion: string;
// }

// export interface InfoEmpresa {
//   corte: Date;
//   formulario: string;
//   num_radicado: string;
//   documentos_adicionales: unknown[];
//   NIT: string;
//   nombreEmpresa: string;
//   puntoEntrada: string;
//   codigoFormulario: string;
// }

export interface Total {
  value: number;
  relation: string;
}
export async function getSiisInfo(nit: number): Promise<SiisData | null> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
    size: 1,
    from: 0,
    query: {
      match: {
        NIT: nit,
      },
    },
    sort: [
      {
        "infoEmpresa.corte": {
          order: "desc",
        },
      },
    ],
    _source: ["region", "ciudad", "departamento", "macroSector", "sector"],
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body,
  };

  try {
    const response = await pRetry(
      () =>
        fetch(
          "https://siis.ia.supersociedades.gov.co/qr/siis_empresas/_search",
          requestOptions,
        ),
      {
        retries: 3,
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch siis data. Status code:", response.status);
      return null;
    }

    const data: SiisResponse = await response.json();

    return data.hits.hits.at(0)?._source ?? null;
  } catch (err) {
    console.error("Failed getting Siis data", err);
    return null;
  }
}
