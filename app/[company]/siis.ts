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
  _source: Source;
  _id: string;
  sort: number[];
  _score: null;
}

export interface Source {
  estado: string;
  financieros: Financieros;
  infoEmpresa: InfoEmpresa;
  fechaEstado: Date;
  nombreEmpresa: string;
  actividadesEconomicas: string[];
  geolocalizacion: Geolocalizacion;
  fechaCorte: Date;
  ciudad: string;
  macroSector: string;
  NIT: string;
  departamento: string;
  fechaConstitucion: Date;
  region: string;
  sector: string;
  puntoEntrada: string;
}

export interface Financieros {
  ingresosEmpresa: number;
  roeAnterior: number;
  roaAnterior: number;
  activos: number;
  roa: number;
  utilidades: number;
  ros: number;
  roe: number;
  margen: number;
}

export interface Geolocalizacion {
  latitud: string;
  longitud: string;
  direccion: string;
}

export interface InfoEmpresa {
  corte: Date;
  formulario: string;
  num_radicado: string;
  documentos_adicionales: any[];
  NIT: string;
  nombreEmpresa: string;
  puntoEntrada: string;
  codigoFormulario: string;
}

export interface Total {
  value: number;
  relation: string;
}
export async function siisApi(nit: number) {
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
    _source: ["*"],
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body,
  };

  const response = await fetch(
    "https://siis.ia.supersociedades.gov.co/qr/siis_empresas/_search",
    requestOptions,
  );

  if (!response.ok) {
    console.error("Failed to fetch siis data. Status code:", response.status);
    return {};
  }

  const data: SiisResponse = await response.json();

  return data.hits.hits.at(0)?._source ?? {};
}
