import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

import { db } from "@/app/db";
import { chambers } from "@/app/db/schema";

export const allChambers = [
  {
    code: 1,
    name: "Cámara de comercio de Armenia",
    address: "Carrera 14 No. 23-15 piso 4",
    city: "Armenia",
    state: "Quindío",
  },
  {
    code: 2,
    name: "Cámara de comercio de Barrancabermeja",
    address: "Calle 9 No. 12-70 piso 2",
    city: "Barrancabermeja",
    state: "Santander",
  },
  {
    code: 3,
    name: "Cámara de comercio de Barranquilla",
    address: "Calle 40 No. 44-39",
    city: "Barranquilla",
    state: "Atlántico",
  },
  {
    code: 4,
    name: "Cámara de comercio de Bogotá",
    address: "Carrera 9 No. 16-21",
    city: "Bogotá D.C.",
    state: "Bogotá D.C.",
  },
  {
    code: 5,
    name: "Cámara de comercio de Bucaramanga",
    address: "Carrera 19 No. 36-20 piso 3",
    city: "Bucaramanga",
    state: "Santander",
  },
  {
    code: 6,
    name: "Cámara de comercio de Buenaventura",
    address: "Edificio Cámara de comercio",
    city: "Buenaventura",
    state: "Valle",
  },
  {
    code: 7,
    name: "Cámara de comercio de Buga",
    address: "Carrera 14 No. 5-53 piso 2",
    city: "Buga",
    state: "Valle",
  },
  {
    code: 8,
    name: "Cámara de comercio de Cali",
    address: "Calle 8 No. 3-14",
    city: "Cali",
    state: "Valle",
  },
  {
    code: 9,
    name: "Cámara de comercio de Cartagena",
    address: "Calle Santa Teresa No. 32- 41",
    city: "Cartagena",
    state: "Bolívar",
  },
  {
    code: 10,
    name: "Cámara de comercio de Cartago",
    address: "Calle 11 No. 4-49 piso 2",
    city: "Cartago",
    state: "Valle",
  },
  {
    code: 11,
    name: "Cámara de comercio de Cúcuta",
    address: "Calle 10 No. 4-38",
    city: "Cúcuta",
    state: "Santander del Norte",
  },
  {
    code: 12,
    name: "Cámara de comercio de Chinchiná",
    address: "Carrera 10 No. 6-08 piso 2",
    city: "Chinchina",
    state: "Caldas",
  },
  {
    code: 13,
    name: "Cámara de comercio de Duitama",
    address: "Calle 16 No. 15-21 piso 5",
    city: "Duitama",
    state: "Boyacá",
  },
  {
    code: 14,
    name: "Cámara de comercio de Girardot",
    address: "Calle 20 A No. 7A-40",
    city: "Girardot",
    state: "Cundinamarca",
  },
  {
    code: 15,
    name: "Cámara de comercio de Honda",
    address: "Calle 12 A No. 10 A -06",
    city: "Honda",
    state: "Tolima",
  },
  {
    code: 16,
    name: "Cámara de comercio de Ibagué",
    address: "Carrera 4 No. 10-77 piso 2",
    city: "Ibagué",
    state: "Tolima",
  },
  {
    code: 17,
    name: "Cámara de comercio de Ipiales",
    address: "Carrera 11 No. 15-28",
    city: "Ipiales",
    state: "Nariño",
  },
  {
    code: 18,
    name: "Cámara de Comercio de La Dorada",
    address: "Carrera 3 No. 14-27 piso 2",
    city: "La Dorada",
    state: "Caldas",
  },
  {
    code: 19,
    name: "Cámara de comercio de Magangué",
    address: "Carrera 4 No. 12-12 piso 2",
    city: "Magangue",
    state: "Bolívar",
  },
  {
    code: 20,
    name: "Cámara de comercio de Manizales",
    address: "Carrera 23 No. 26-60",
    city: "Manizales",
    state: "Caldas",
  },
  {
    code: 21,
    name: "Cámara de comercio de Medellín para Antioquia",
    address: "Ave. Oriental carrera 46 No. 52-82",
    city: "Medellín",
    state: "Antioquia",
  },
  {
    code: 22,
    name: "Cámara de comercio de Montería",
    address: "Calle 28 No. 4-33",
    city: "Montería",
    state: "Córdoba",
  },
  {
    code: 23,
    name: "Cámara de comercio de Neiva",
    address: "Carrera 5 No. 10-38 piso 3",
    city: "Neiva",
    state: "Huila",
  },
  {
    code: 24,
    name: "Cámara de comercio de Palmira",
    address: "Calle 28 No. 30-15",
    city: "Palmira",
    state: "Valle",
  },
  {
    code: 25,
    name: "Cámara de comercio de Pamplona",
    address: "Carrera 6 No. 4-17",
    city: "Pamplona",
    state: "Norte de Santander",
  },
  {
    code: 26,
    name: "Cámara de comercio de Pasto",
    address: "Calle 18 No. 28-84",
    city: "Pasto",
    state: "Nariño",
  },
  {
    code: 27,
    name: "Cámara de comercio de Pereira",
    address: "Carrera 8 No. 23-09 local 10",
    city: "Pereira",
    state: "Risaralda",
  },
  {
    code: 28,
    name: "Cámara de comercio del Cauca",
    address: "Carrera 7 No. 4-36",
    city: "Popayán",
    state: "Cauca",
  },
  {
    code: 29,
    name: "Cámara de comercio de Quibdó",
    address: "Calle 26 No. 5-21",
    city: "Quibdo",
    state: "Chocó",
  },
  {
    code: 30,
    name: "Cámara de comercio de Riohacha",
    address: "Calle 12 No. 8-62",
    city: "Riohacha",
    state: "Guajira ",
  },
  {
    code: 31,
    name: "Cámara de comercio de San Andrés",
    address: "Ave. Francisco Newball No 4 A",
    city: "San Andrés Islas",
    state: "San Andrés Islas",
  },
  {
    code: 32,
    name: "Cámara de comercio de Santa Marta",
    address: "Carrera 1 C No. 22-58",
    city: "Santa Marta",
    state: "Magdalena",
  },
  {
    code: 33,
    name: "Cámara de comercio de Santa Rosa de Cabal",
    address: "Calle 14 No. 15-78 piso 2",
    city: "Santa Rosa de Cabal",
    state: "Risaralda",
  },
  {
    code: 34,
    name: "Cámara de comercio de Sincelejo",
    address: "Calle 22 No. 17-62 piso 2",
    city: "Sincelejo",
    state: "Sucre",
  },
  {
    code: 35,
    name: "Cámara de comercio de Sogamoso",
    address: "Carrera 10 No. 12-14 piso 2",
    city: "Sogamoso",
    state: "Boyacá",
  },
  {
    code: 36,
    name: "Cámara de comercio de Tuluá",
    address: "Calle 26 No. 24-57",
    city: "Tulúa",
    state: "Valle",
  },
  {
    code: 37,
    name: "Cámara de comercio de Tumaco",
    address: "Calle Sucre",
    city: "Tumaco",
    state: "Nariño",
  },
  {
    code: 38,
    name: "Cámara de comercio de Tunja",
    address: "Calle 21 No. 10-52",
    city: "Tunja",
    state: "Boyacá",
  },
  {
    code: 39,
    name: "Cámara de comercio de Valledupar",
    address: "Calle 15 No. 4-23 piso 2",
    city: "Valledupar",
    state: "Cesar",
  },
  {
    code: 40,
    name: "Cámara de comercio de Villavicencio",
    address: "Calle 39 No. 31-47",
    city: "Villavicencio",
    state: "Meta",
  },
  {
    code: 41,
    name: "Cámara de comercio de Florencia",
    address: "Calle 17 No. 8-72",
    city: "Florencia",
    state: "Caquetá",
  },
  {
    code: 42,
    name: "Cámara de comercio de Amazonas",
    address: "Carrera 11 No. 11-09",
    city: "Leticia",
    state: "Amazonas",
  },
  {
    code: 43,
    name: "Cámara de comercio de Sevilla",
    address: "Palacio Municipal piso1",
    city: "Sevilla",
    state: "Valle",
  },
  {
    code: 44,
    name: "Cámara de comercio de Urabá",
    address: "Calle 109 No. 100-41",
    city: "Apartadó",
    state: "Antioquia",
  },
  {
    code: 45,
    name: "Cámara de comercio Sur y Oriente del Tolima",
    address: "Carrera 8 No. 8-35",
    city: "Espinal",
    state: "Tolima",
  },
  {
    code: 46,
    name: "Cámara de comercio del Putumayo",
    address: "Carrera 22 calle 10 esq. Edificio Londoño",
    city: "PuertoAsís",
    state: "Putumayo",
  },
  {
    code: 47,
    name: "Cámara de comercio de Facatativá",
    address: "Carrera 2 No 2-89",
    city: "Facatativá",
    state: "Cundinamarca",
  },
  {
    code: 48,
    name: "Cámara de comercio de Arauca",
    address: "Carrera 25 No. 18 A 49",
    city: "Arauca",
    state: "Arauca",
  },
  {
    code: 49,
    name: "Cámara de Comercio de Ocaña",
    address: "Calle 10 No. 15-12",
    city: "Ocaña",
    state: "Norte de Santander",
  },
  {
    code: 50,
    name: "Cámara de comercio de Casanare",
    address: "Carrera 9 No. 20-45 ofc. 201",
    city: "Yopal",
    state: "Casanare",
  },
  {
    code: 51,
    name: "Cámara de comercio del Oriente Antioqueño",
    address: "Calle 51 No. 46-24",
    city: "Rionegro",
    state: "Antioquia",
  },
  {
    code: 52,
    name: "Cámara de comercio del Magdalena Medio y nordeste Antioqueño",
    address: "Calle 7 No. 1-34 piso 2",
    city: "Puerto Berrío",
    state: "Antioquia",
  },
  {
    code: 53,
    name: "Cámara de comercio de Aguachica",
    address: "Calle 6 No. 17-23",
    city: "Aguachica",
    state: "Cesar",
  },
  {
    code: 54,
    name: "Cámara de comercio de Dosquebradas",
    address: "Plaza del Sol oficina 212 y 213",
    city: "Dosquebradas",
    state: "Risaralda",
  },
  {
    code: 55,
    name: "Cámara de comercio del Aburrá Sur",
    address: "Calle 48 No. 50-16",
    city: "Itaguí",
    state: "Antioquia",
  },
  {
    code: 56,
    name: "Cámara de comercio Pie de Monte Araucano",
    address: "Calle 27 No. 15-57",
    city: "Saravena",
    state: "Arauca",
  },
  {
    code: 57,
    name: "Cámara de comercio de San José",
    address: "Carrera 22 No. 9-17",
    city: "San José del Guaviare",
    state: "Guaviare",
  },
];

async function seedChambers() {
  await db.insert(chambers).values(allChambers);
}

seedChambers();
