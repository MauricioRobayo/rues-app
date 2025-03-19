import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";

interface Chamber {
  code: string;
  name: string;
  city: string;
  address: string;
  state: string;
  email: string | null;
  phoneNumber: string | null;
  certificateUrl: string;
  url: string;
  openDataSet?: {
    id: string;
    recordKey: keyof CompanyRecordDto;
    queryKey: "matricula" | "nit" | "identificacion";
  };
}
export const chambers: Record<string, Chamber> = {
  "10": {
    code: "10",
    name: "Cámara de comercio de Cartago",
    city: "Cartago",
    address: "Calle 11 No. 4-49 piso 2",
    state: "Valle",
    email: "correspondencia@camaracartago.org",
    phoneNumber: "(602) 217 99 12",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=10",
    url: "http://www.camaracartago.org/",
    openDataSet: {
      id: "2rd9-kmzf",
      queryKey: "matricula",
      recordKey: "registrationNumber",
    },
  },
  "11": {
    code: "11",
    name: "Cámara de comercio de Cúcuta",
    city: "Cúcuta",
    address: "Calle 10 No. 4-38",
    state: "Santander del Norte",
    email: null,
    phoneNumber: null,
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=11",
    url: "https://cindoccc@cccucuta.org.co",
    openDataSet: {
      id: "w98a-ssvz",
      recordKey: "nit",
      queryKey: "identificacion",
    },
  },
  "12": {
    code: "12",
    name: "Cámara de comercio de Chinchiná",
    city: "Chinchina",
    address: "Carrera 10 No. 6-08 piso 2",
    state: "Caldas",
    email: "promocion_desarrollo@camaracomerciochinchina.org",
    phoneNumber: "(606) 8400446",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=12",
    url: "http://www.camaracomerciochinchina.org/",
  },
  "13": {
    code: "13",
    name: "Cámara de comercio de Duitama",
    city: "Duitama",
    address: "Calle 16 No. 15-21 piso 5",
    state: "Boyacá",
    email: "ccdjuridica@ccduitama.org.co",
    phoneNumber: null,
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=13",
    url: "http://www.ccduitama.org.co/",
  },
  "14": {
    code: "14",
    name: "Cámara de comercio de Girardot",
    city: "Girardot",
    address: "Calle 20 A No. 7A-40",
    state: "Cundinamarca",
    email: "cagira@ccgirardot.org",
    phoneNumber: null,
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=14",
    url: "http://www.ccgirardot.org/",
  },
  "15": {
    code: "15",
    name: "Cámara de comercio de Honda",
    city: "Honda",
    address: "Calle 12 A No. 10 A -06",
    state: "Tolima",
    email: "contacto@camarahonda.org.co",
    phoneNumber: "315 - 8780835",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=15",
    url: "http://www.camarahonda.org.co/",
  },
  "16": {
    code: "16",
    name: "Cámara de comercio de Ibagué",
    city: "Ibagué",
    address: "Carrera 4 No. 10-77 piso 2",
    state: "Tolima",
    email: null,
    phoneNumber: "(608) 277 2000",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=16",
    url: "http://www.ccibague.org/",
    openDataSet: {
      id: "gwqv-sqvs",
      recordKey: "registrationNumber",
      queryKey: "matricula",
    },
  },
  "17": {
    code: "17",
    name: "Cámara de comercio de Ipiales",
    city: "Ipiales",
    address: "Carrera 11 No. 15-28",
    state: "Nariño",
    email: "registropublico@ccipiales.org.co",
    phoneNumber: null,
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=17",
    url: "http://www.ccipiales.org.co/",
    openDataSet: {
      id: "kcck-53z5",
      recordKey: "registrationNumber",
      queryKey: "matricula",
    },
  },
  "18": {
    code: "18",
    name: "Cámara de Comercio de La Dorada",
    city: "La Dorada",
    address: "Carrera 3 No. 14-27 piso 2",
    state: "Caldas",
    email: "secretaria@camaradorada.org.co",
    phoneNumber: null,
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=18",
    url: "http://www.camaradorada.org.co/",
    openDataSet: {
      id: "4g2z-f9xs",
      recordKey: "nit",
      queryKey: "nit",
    },
  },
  "19": {
    code: "19",
    name: "Cámara de comercio de Magangué",
    city: "Magangue",
    address: "Carrera 4 No. 12-12 piso 2",
    state: "Bolívar",
    email: "ccmagangue@ccmagangue.org.co",
    phoneNumber: "(605) 5846175",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=19",
    url: "http://www.ccmagangue.org.co/",
  },
  "20": {
    code: "20",
    name: "Cámara de comercio de Manizales",
    city: "Manizales",
    address: "Carrera 23 No. 26-60",
    state: "Caldas",
    email: "contactenos@ccm.org.co",
    phoneNumber: "(606) 884 1840 - 3025548484",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=20",
    url: "http://www.ccmpc.org.co/",
  },
  "21": {
    code: "21",
    name: "Cámara de comercio de Medellín para Antioquia",
    city: "Medellín",
    address: "Ave. Oriental carrera 46 No. 52-82",
    state: "Antioquia",
    email: null,
    phoneNumber: "(604) 444 9758",
    certificateUrl: "http://virtuales.camaramedellin.com.co/e-cer/",
    url: "https://www.camaramedellin.com.co/",
  },
  "22": {
    code: "22",
    name: "Cámara de comercio de Montería",
    city: "Montería",
    address: "Calle 28 No. 4-33",
    state: "Córdoba",
    email: "presidenciaejecutiva@ccmonteria.org.co",
    phoneNumber: "3174583769",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=22",
    url: "http://www.ccmonteria.org.co/",
  },
  "23": {
    code: "23",
    name: "Cámara de comercio de Neiva",
    city: "Neiva",
    address: "Carrera 5 No. 10-38 piso 3",
    state: "Huila",
    email: "pqr@cchuila.org",
    phoneNumber: null,
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=23",
    url: "https://www.cchuila.org/",
  },
  "24": {
    code: "24",
    name: "Cámara de comercio de Palmira",
    city: "Palmira",
    address: "Calle 28 No. 30-15",
    state: "Valle",
    email: "comunicaciones@ccpalmira.org.co",
    phoneNumber: "(602) 2806911",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=24",
    url: "https://www.ccpalmira.org.co/",
    openDataSet: {
      id: "ijer-xd9k",
      recordKey: "registrationNumber",
      queryKey: "matricula",
    },
  },
  "25": {
    code: "25",
    name: "Cámara de comercio de Pamplona",
    city: "Pamplona",
    address: "Carrera 6 No. 4-17",
    state: "Norte de Santander",
    email: "ccpamplona@camarapamplona.org.co",
    phoneNumber: "(607) 568 4696 - (607) 568 2047",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=25",
    url: "http://www.camarapamplona.org.co",
  },
  "26": {
    code: "26",
    name: "Cámara de comercio de Pasto",
    city: "Pasto",
    address: "Calle 18 No. 28-84",
    state: "Nariño",
    email: "presidencia2@ccpasto.org.co",
    phoneNumber: "(602) 7215735",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=26",
    url: "http://www.ccpasto.org.co/",
  },
  "27": {
    code: "27",
    name: "Cámara de comercio de Pereira",
    city: "Pereira",
    address: "Carrera 8 No. 23-09 local 10",
    state: "Risaralda",
    email: "servicioalcliente@camarapereira.org.co",
    phoneNumber: null,
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=27",
    url: "https://www.camarapereira.org.co",
    openDataSet: {
      id: "c35x-mutb",
      recordKey: "registrationNumber",
      queryKey: "matricula",
    },
  },
  "28": {
    code: "28",
    name: "Cámara de comercio del Cauca",
    city: "Popayán",
    address: "Carrera 7 No. 4-36",
    state: "Cauca",
    email: "contacto@ccas.org.co",
    phoneNumber: "(602) 824 3625",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=28",
    url: "http://www.cccauca.org.co/",
  },
  "29": {
    code: "29",
    name: "Cámara de comercio de Quibdó",
    city: "Quibdo",
    address: "Calle 26 No. 5-21",
    state: "Chocó",
    email: "ccq@ccq.org.co",
    phoneNumber: "(604) 6726020",
    certificateUrl:
      "https://virtuales.camarachoco.org.co/certificadoselectronicos/",
    url: "https://camarachoco.org.co/",
    openDataSet: {
      id: "drwf-rmb8",
      recordKey: "registrationNumber",
      queryKey: "matricula",
    },
  },
  "30": {
    code: "30",
    name: "Cámara de comercio de Riohacha",
    city: "Riohacha",
    address: "Calle 12 No. 8-62",
    state: "Guajira ",
    email: "mcabarcas@camaraguagira.com",
    phoneNumber: "(605) 7279800",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=30",
    url: "https://www.camaraguajira.org/",
  },
  "31": {
    code: "31",
    name: "Cámara de comercio de San Andrés",
    city: "San Andrés Islas",
    address: "Ave. Francisco Newball No 4 A",
    state: "San Andrés Islas",
    email: "pqrsf@camarasai.org",
    phoneNumber: "(608) 512 3803",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=31",
    url: "http://www.camarasai.org/",
  },
  "32": {
    code: "32",
    name: "Cámara de comercio de Santa Marta",
    city: "Santa Marta",
    address: "Carrera 1 C No. 22-58",
    state: "Magdalena",
    email: "camarasm@ccsm.org.co",
    phoneNumber: "(605) 4209909 -3114147779",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=32",
    url: "http://www.ccsm.org.co/",
  },
  "33": {
    code: "33",
    name: "Cámara de comercio de Santa Rosa de Cabal",
    city: "Santa Rosa de Cabal",
    address: "Calle 14 No. 15-78 piso 2",
    state: "Risaralda",
    email: "servicioalcliente@camarapereira.org.co",
    phoneNumber: null,
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=33",
    url: "https://www.camarapereira.org.co",
  },
  "34": {
    code: "34",
    name: "Cámara de comercio de Sincelejo",
    city: "Sincelejo",
    address: "Calle 22 No. 17-62 piso 2",
    state: "Sucre",
    email: "ccsincelejo@ccsincelejo.org",
    phoneNumber: "(605) 2762603",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=34",
    url: "http://ccsincelejo.org/",
  },
  "35": {
    code: "35",
    name: "Cámara de comercio de Sogamoso",
    city: "Sogamoso",
    address: "Carrera 10 No. 12-14 piso 2",
    state: "Boyacá",
    email: "info@camarasogamoso.org",
    phoneNumber: "(608) 7702954",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=35",
    url: "http://camarasogamoso.org/",
  },
  "36": {
    code: "36",
    name: "Cámara de comercio de Tuluá",
    city: "Tulúa",
    address: "Calle 26 No. 24-57",
    state: "Valle",
    email: "contactenos@camaratulua.org",
    phoneNumber: "316-0260236",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=36",
    url: "http://camaratulua.org/",
  },
  "37": {
    code: "37",
    name: "Cámara de comercio de Tumaco",
    city: "Tumaco",
    address: "Calle Sucre",
    state: "Nariño",
    email: "direccionejecutiva@cctumaco.org",
    phoneNumber: null,
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=37",
    url: "http://cctumaco.org/",
  },
  "38": {
    code: "38",
    name: "Cámara de comercio de Tunja",
    city: "Tunja",
    address: "Calle 21 No. 10-52",
    state: "Boyacá",
    email: "info@cctunja.org.co",
    phoneNumber: "(608) 7474660",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=38",
    url: "http://cctunja.org.co/",
  },
  "39": {
    code: "39",
    name: "Cámara de comercio de Valledupar",
    city: "Valledupar",
    address: "Calle 15 No. 4-23 piso 2",
    state: "Cesar",
    email: "secretariadetransparencia@ccvalledupar.org.co",
    phoneNumber: null,
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=39",
    url: "http://ccvalledupar.org.co/",
  },
  "40": {
    code: "40",
    name: "Cámara de comercio de Villavicencio",
    city: "Villavicencio",
    address: "Calle 39 No. 31-47",
    state: "Meta",
    email: "informacion@ccv.org.co",
    phoneNumber: "(608) 6817777",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=40",
    url: "http://ccv.org.co/",
  },
  "41": {
    code: "41",
    name: "Cámara de comercio de Florencia",
    city: "Florencia",
    address: "Calle 17 No. 8-72",
    state: "Caquetá",
    email: null,
    phoneNumber: "317 - 6584601",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=41",
    url: "http://www.ccflorencia.org.co/",
    openDataSet: {
      id: "tgjm-ux96",
      recordKey: "registrationNumber",
      queryKey: "matricula",
    },
  },
  "42": {
    code: "42",
    name: "Cámara de comercio de Amazonas",
    city: "Leticia",
    address: "Carrera 11 No. 11-09",
    state: "Amazonas",
    email: "ccamazonas@ccamazonas.org.co",
    phoneNumber: "310- 8588317",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=42",
    url: "http://www.ccamazonas.org.co/actual/",
  },
  "43": {
    code: "43",
    name: "Cámara de comercio de Sevilla",
    city: "Sevilla",
    address: "Palacio Municipal piso1",
    state: "Valle",
    email: "contacto@camcciosevilla.org.co",
    phoneNumber: "(602) 2196837",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=43",
    url: "https://camcciosevilla.org.co/",
  },
  "44": {
    code: "44",
    name: "Cámara de comercio de Urabá",
    city: "Apartadó",
    address: "Calle 109 No. 100-41",
    state: "Antioquia",
    email: "eladio.ramirez@ccuraba.org.co",
    phoneNumber: "(604) 8155990 - 321 8520767",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=44",
    url: "https://www.ccuraba.org.co/",
  },
  "45": {
    code: "45",
    name: "Cámara de comercio Sur y Oriente del Tolima",
    city: "Espinal",
    address: "Carrera 8 No. 8-35",
    state: "Tolima",
    email: "contactenos@ccsurortolima.org.co",
    phoneNumber: "(608) 2485377",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=45",
    url: "https://www.ccsurortolima.org.co/",
  },
  "46": {
    code: "46",
    name: "Cámara de comercio del Putumayo",
    city: "PuertoAsís",
    address: "Carrera 22 calle 10 esq. Edificio Londoño",
    state: "Putumayo",
    email: "correspondencia@ccputumayo.org.co",
    phoneNumber: "(608) 4227173 - 311 222 1149",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=46",
    url: "https://www.ccputumayo.org.co/",
  },
  "47": {
    code: "47",
    name: "Cámara de comercio de Facatativá",
    city: "Facatativá",
    address: "Carrera 2 No 2-89",
    state: "Cundinamarca",
    email: "correspondencia@ccfacatativa.org.co",
    phoneNumber: "(601) 8902833 - 3106691309",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=47",
    url: "http://www.ccfacatativa.org.co/",
  },
  "48": {
    code: "48",
    name: "Cámara de comercio de Arauca",
    city: "Arauca",
    address: "Carrera 25 No. 18 A 49",
    state: "Arauca",
    email: "pqrsf@ccarauca.org.co",
    phoneNumber: "(607) 885 3356",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=48",
    url: "https://ccarauca.org.co/",
  },
  "49": {
    code: "49",
    name: "Cámara de Comercio de Ocaña",
    city: "Ocaña",
    address: "Calle 10 No. 15-12",
    state: "Norte de Santander",
    email: "camaraoc@camaraocana.com",
    phoneNumber: "(607) 562 6105",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=49",
    url: "http://www.camaraocana.com/",
  },
  "50": {
    code: "50",
    name: "Cámara de comercio de Casanare",
    city: "Yopal",
    address: "Carrera 9 No. 20-45 ofc. 201",
    state: "Casanare",
    email: "contactenos@cccasanare.co",
    phoneNumber: "313-3935002",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=50",
    url: "http://www.cccasanare.co/",
  },
  "51": {
    code: "51",
    name: "Cámara de comercio del Oriente Antioqueño",
    city: "Rionegro",
    address: "Calle 51 No. 46-24",
    state: "Antioquia",
    email: null,
    phoneNumber: "(604) 531 2514",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=51",
    url: "https://www.ccoa.org.co/",
  },
  "52": {
    code: "52",
    name: "Cámara de comercio del Magdalena Medio y nordeste Antioqueño",
    city: "Puerto Berrío",
    address: "Calle 7 No. 1-34 piso 2",
    state: "Antioquia",
    email: "juridica@ccmmna.org.co",
    phoneNumber: "(604) 833 2730 - 3146805300",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=52",
    url: "http://www.ccmmna.org.co/",
  },
  "53": {
    code: "53",
    name: "Cámara de comercio de Aguachica",
    city: "Aguachica",
    address: "Calle 6 No. 17-23",
    state: "Cesar",
    email: "ccaguachica@camaraaguachica.org.co",
    phoneNumber: "316 0233043",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=53",
    url: "https://camaraaguachica.org.co/",
  },
  "54": {
    code: "54",
    name: "Cámara de comercio de Dosquebradas",
    city: "Dosquebradas",
    address: "Plaza del Sol oficina 212 y 213",
    state: "Risaralda",
    email: "contactenos@camado.org.co",
    phoneNumber: "(606) 322 8599",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=54",
    url: "http://www.camado.org.co/",
    openDataSet: {
      id: "f9nk-qw9u",
      recordKey: "registrationNumber",
      queryKey: "matricula",
    },
  },
  "55": {
    code: "55",
    name: "Cámara de comercio del Aburrá Sur",
    city: "Itaguí",
    address: "Calle 48 No. 50-16",
    state: "Antioquia",
    email: null,
    phoneNumber: "(604) 444 2344 - 3153623534",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=55",
    url: "http://www.ccas.org.co/",
  },
  "56": {
    code: "56",
    name: "Cámara de comercio Pie de Monte Araucano",
    city: "Saravena",
    address: "Calle 27 No. 15-57",
    state: "Arauca",
    email: "pqrsf@ccarauca.org.co",
    phoneNumber: "(607) 885 3356",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=56",
    url: "https://ccarauca.org.co/",
  },
  "57": {
    code: "57",
    name: "Cámara de comercio de San José",
    city: "San José del Guaviare",
    address: "Carrera 22 No. 9-17",
    state: "Guaviare",
    email: "correo@camarasanjose.org.co",
    phoneNumber: "(608) 5841700 - 3123500368",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=57",
    url: "http://camarasanjose.org.co/inicio",
  },
  "01": {
    code: "01",
    name: "Cámara de comercio de Armenia",
    city: "Armenia",
    address: "Carrera 14 No. 23-15 piso 4",
    state: "Quindío",
    email: "camara@camaraarmenia.org.co",
    phoneNumber: "318 - 3499804",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=01",
    url: "http://www.camaraarmenia.org.co/",
    openDataSet: {
      id: "rptq-q4rd",
      recordKey: "registrationNumber",
      queryKey: "matricula",
    },
  },
  "02": {
    code: "02",
    name: "Cámara de comercio de Barrancabermeja",
    city: "Barrancabermeja",
    address: "Calle 9 No. 12-70 piso 2",
    state: "Santander",
    email: "info@ccbarranca.org.co",
    phoneNumber: "(607) 6007110",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=02",
    url: "http://www.ccbarranca.org.co/",
  },
  "03": {
    code: "03",
    name: "Cámara de comercio de Barranquilla",
    city: "Barranquilla",
    address: "Calle 40 No. 44-39",
    state: "Atlántico",
    email: "comunica@camarabaq.org.co",
    phoneNumber: "(605) 330 3700",
    certificateUrl:
      "https://www2.camarabaq.org.co/certificadoWeb/certificadospublico.jsf#no-back-button",
    url: "http://www.camarabaq.org.co/",
  },
  "04": {
    code: "04",
    name: "Cámara de comercio de Bogotá",
    city: "Bogotá D.C.",
    address: "Carrera 9 No. 16-21",
    state: "Bogotá D.C.",
    email: null,
    phoneNumber: "(601) 383 0300 - 317 2577909",
    certificateUrl:
      "https://www.ccb.org.co/Tramites-y-Consultas/Mas-informacion/Certificados-electronicos/",
    url: "http://www.ccb.org.co/",
  },
  "05": {
    code: "05",
    name: "Cámara de comercio de Bucaramanga",
    city: "Bucaramanga",
    address: "Carrera 19 No. 36-20 piso 3",
    state: "Santander",
    email: null,
    phoneNumber: "(607) 652 7000",
    certificateUrl:
      "http://certificadoccb.camaradirecta.com:8080/certificadoWeb/certificadospublico.jsf#no-back-button",
    url: "http://www.camaradirecta.com/",
    openDataSet: {
      id: "wf53-j577",
      recordKey: "fullNit",
      queryKey: "nit",
    },
  },
  "06": {
    code: "06",
    name: "Cámara de comercio de Buenaventura",
    city: "Buenaventura",
    address: "Edificio Cámara de comercio",
    state: "Valle",
    email: "info@ccbun.org.co",
    phoneNumber: "315-8123566",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=06",
    url: "http://www.ccbun.org/",
  },
  "07": {
    code: "07",
    name: "Cámara de comercio de Buga",
    city: "Buga",
    address: "Carrera 14 No. 5-53 piso 2",
    state: "Valle",
    email: "juridico@ccbun.org.co",
    phoneNumber: "(602) 237 1123",
    certificateUrl:
      "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=07",
    url: "http://www.ccbuga.org.co/",
  },
  "08": {
    code: "08",
    name: "Cámara de comercio de Cali",
    city: "Cali",
    address: "Calle 8 No. 3-14",
    state: "Valle",
    email: "contacto@ccc.org.co",
    phoneNumber: "(602) 886 1300",
    certificateUrl:
      "https://enlinea.ccc.org.co/certificadoElectronico/#/comprar-certificados",
    url: "http://www.ccc.org.co/",
  },
  "09": {
    code: "09",
    name: "Cámara de comercio de Cartagena",
    city: "Cartagena",
    address: "Calle Santa Teresa No. 32- 41",
    state: "Bolívar",
    email: null,
    phoneNumber: "(605) 642 8999",
    certificateUrl: "http://serviciosvirtuales.cccartagena.org.co/e-cer/",
    url: "http://www.cccartagena.org.co/",
  },
};

function isChamberCode(code: string): code is keyof typeof chambers {
  return code in chambers;
}

export function getChamber(code: string) {
  const paddedCode = code.padStart(2, "0");
  if (isChamberCode(paddedCode)) {
    return chambers[paddedCode];
  }

  return null;
}
