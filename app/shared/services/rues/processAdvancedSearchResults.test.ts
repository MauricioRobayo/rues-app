import { dedupeResults } from "@/app/shared/services/rues/processAdvancesSearchResults";
import { expect, test } from "vitest";

test("should preserve array when no duplicated NITs", () => {
  const mockResults = [
    { nit: "3", estado_matricula: "ACTIVA" },
    { nit: "2", estado_matricula: "CANCELADA" },
    { nit: "4", estado_matricula: "ACTIVA" },
  ];
  expect(dedupeResults(mockResults)).toEqual(mockResults);
});

test("should remove non active NITs when duplicated", () => {
  const mockResults = [
    { nit: "1", estado_matricula: "CANCELADA" },
    { nit: "3", estado_matricula: "CANCELADA" },
    { nit: "2", estado_matricula: "CANCELADA" },
    { nit: "2", estado_matricula: "CANCELADA" },
    { nit: "2", estado_matricula: "CANCELADA" },
    { nit: "2", estado_matricula: "CANCELADA" },
    { nit: "2", estado_matricula: "CANCELADA" },
    { nit: "2", estado_matricula: "CANCELADA" },
    { nit: "2", estado_matricula: "ACTIVA" },
    { nit: "2", estado_matricula: "CANCELADA" },
    { nit: "2", estado_matricula: "CANCELADA" },
  ];
  expect(dedupeResults(mockResults)).toEqual([
    { nit: "1", estado_matricula: "CANCELADA" },
    { nit: "3", estado_matricula: "CANCELADA" },
    { nit: "2", estado_matricula: "ACTIVA" },
  ]);
});

test("should dedupe duplicated NITs preserving the active one", () => {
  const mockResults = [
    { nit: "7", estado_matricula: "CANCELADA" },
    { nit: "4", estado_matricula: "ACTIVA" },
    { nit: "1", estado_matricula: "CANCELADA" },
    { nit: "5", estado_matricula: "CANCELADA" },
    { nit: "1", estado_matricula: "CANCELADA" },
    { nit: "7", estado_matricula: "ACTIVA" },
    { nit: "1", estado_matricula: "CANCELADA" },
    { nit: "1", estado_matricula: "ACTIVA" },
    { nit: "6", estado_matricula: "CANCELADA" },
    { nit: "1", estado_matricula: "CANCELADA" },
    { nit: "7", estado_matricula: "CANCELADA" },
    { nit: "1", estado_matricula: "CANCELADA" },
  ];
  const sortedResults = dedupeResults(mockResults);
  expect(sortedResults).toEqual([
    { nit: "7", estado_matricula: "ACTIVA" },
    { nit: "4", estado_matricula: "ACTIVA" },
    { nit: "1", estado_matricula: "ACTIVA" },
    { nit: "5", estado_matricula: "CANCELADA" },
    { nit: "6", estado_matricula: "CANCELADA" },
  ]);
});

test("should dedupe NITs and preserver existing order if no active one", () => {
  const mockData = [
    { nit: "1", estado_matricula: "CANCELADA", razon_social: "1a" },
    { nit: "1", estado_matricula: "CANCELADA", razon_social: "1b" },
    { nit: "1", estado_matricula: "CANCELADA", razon_social: "1c" },
    { nit: "2", estado_matricula: "CANCELADA", razon_social: "2a" },
    { nit: "2", estado_matricula: "CANCELADA", razon_social: "2b" },
    { nit: "2", estado_matricula: "CANCELADA", razon_social: "2c" },
    { nit: "3", estado_matricula: "CANCELADA", razon_social: "3a" },
    { nit: "3", estado_matricula: "CANCELADA", razon_social: "3b" },
    { nit: "3", estado_matricula: "CANCELADA", razon_social: "3c" },
  ];
  expect(dedupeResults(mockData)).toEqual([
    { nit: "1", estado_matricula: "CANCELADA", razon_social: "1a" },
    { nit: "2", estado_matricula: "CANCELADA", razon_social: "2a" },
    { nit: "3", estado_matricula: "CANCELADA", razon_social: "3a" },
  ]);
});
