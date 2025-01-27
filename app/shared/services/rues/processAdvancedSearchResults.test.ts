import { dedupeResults } from "@/app/shared/services/rues/processAdvancesSearchResults";
import { expect, test } from "vitest";

const otherFields = { ultimo_ano_renovado: "0" };

test("should preserve array when no duplicated NITs", () => {
  const mockResults = [
    { nit: "3", estado_matricula: "ACTIVA", ...otherFields },
    { nit: "2", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "4", estado_matricula: "ACTIVA", ...otherFields },
  ];
  expect(dedupeResults(mockResults)).toEqual(mockResults);
});

test("should remove non active NITs when duplicated", () => {
  const mockResults = [
    { nit: "1", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "3", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "2", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "2", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "2", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "2", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "2", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "2", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "2", estado_matricula: "ACTIVA", ...otherFields },
    { nit: "2", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "2", estado_matricula: "CANCELADA", ...otherFields },
  ];
  expect(dedupeResults(mockResults)).toEqual([
    { nit: "1", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "3", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "2", estado_matricula: "ACTIVA", ...otherFields },
  ]);
});

test("should dedupe duplicated NITs preserving the active one", () => {
  const mockResults = [
    { nit: "7", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "4", estado_matricula: "ACTIVA", ...otherFields },
    { nit: "1", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "5", estado_matricula: "CANCELADA", ultimo_ano_renovado: "2020" },
    { nit: "1", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "7", estado_matricula: "ACTIVA", ...otherFields },
    { nit: "1", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "5", estado_matricula: "CANCELADA", ultimo_ano_renovado: "2023" },
    { nit: "1", estado_matricula: "ACTIVA", ...otherFields },
    { nit: "6", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "1", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "7", estado_matricula: "CANCELADA", ...otherFields },
    { nit: "1", estado_matricula: "CANCELADA", ...otherFields },
  ];
  const sortedResults = dedupeResults(mockResults);
  expect(sortedResults).toEqual([
    { nit: "7", estado_matricula: "ACTIVA", ...otherFields },
    { nit: "4", estado_matricula: "ACTIVA", ...otherFields },
    { nit: "1", estado_matricula: "ACTIVA", ...otherFields },
    { nit: "5", estado_matricula: "CANCELADA", ultimo_ano_renovado: "2023" },
    { nit: "6", estado_matricula: "CANCELADA", ...otherFields },
  ]);
});

test("should dedupe NITs and sort by renewal year if no active one", () => {
  const mockData = [
    {
      nit: "1",
      estado_matricula: "CANCELADA",
      razon_social: "1a",
      ultimo_ano_renovado: "2018",
    },
    {
      nit: "1",
      estado_matricula: "CANCELADA",
      razon_social: "1b",
      ultimo_ano_renovado: "2020",
    },
    {
      nit: "1",
      estado_matricula: "CANCELADA",
      razon_social: "1c",
      ...otherFields,
    },
    {
      nit: "2",
      estado_matricula: "CANCELADA",
      razon_social: "2a",
      ...otherFields,
    },
    {
      nit: "2",
      estado_matricula: "CANCELADA",
      razon_social: "2b",
      ...otherFields,
    },
    {
      nit: "2",
      estado_matricula: "CANCELADA",
      razon_social: "2c",
      ...otherFields,
    },
    {
      nit: "3",
      estado_matricula: "CANCELADA",
      razon_social: "3a",
      ...otherFields,
    },
    {
      nit: "3",
      estado_matricula: "CANCELADA",
      razon_social: "3b",
      ...otherFields,
    },
    {
      nit: "3",
      estado_matricula: "CANCELADA",
      razon_social: "3c",
      ...otherFields,
    },
  ];
  expect(dedupeResults(mockData)).toEqual([
    {
      nit: "1",
      estado_matricula: "CANCELADA",
      razon_social: "1b",
      ultimo_ano_renovado: "2020",
    },
    {
      nit: "2",
      estado_matricula: "CANCELADA",
      razon_social: "2a",
      ...otherFields,
    },
    {
      nit: "3",
      estado_matricula: "CANCELADA",
      razon_social: "3a",
      ...otherFields,
    },
  ]);
});
