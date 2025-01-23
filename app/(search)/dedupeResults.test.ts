import { dedupeResults } from "@/app/(search)/dedupeResults";
import { expect, test } from "vitest";

test("should preserve array when no duplicated NITs", () => {
  const mockResults = [
    { nit: "3", estado: "ACTIVA" },
    { nit: "2", estado: "CANCELADA" },
    { nit: "4", estado: "ACTIVA" },
  ];
  expect(dedupeResults(mockResults)).toEqual(mockResults);
});

test("should remove non active NITs when duplicated", () => {
  const mockResults = [
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "ACTIVA" },
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "CANCELADA" },
  ];
  expect(dedupeResults(mockResults)).toEqual([{ nit: "1", estado: "ACTIVA" }]);
});

test("should dedupe duplicated NITs preserving the active one", () => {
  const mockResults = [
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "ACTIVA" },
    { nit: "1", estado: "CANCELADA" },
    { nit: "1", estado: "CANCELADA" },
    { nit: "4", estado: "ACTIVA" },
    { nit: "5", estado: "CANCELADA" },
    { nit: "6", estado: "CANCELADA" },
    { nit: "7", estado: "ACTIVA" },
    { nit: "7", estado: "CANCELADA" },
    { nit: "7", estado: "CANCELADA" },
  ];
  const sortedResults = dedupeResults(mockResults);
  expect(sortedResults).toEqual([
    { nit: "1", estado: "ACTIVA" },
    { nit: "4", estado: "ACTIVA" },
    { nit: "5", estado: "CANCELADA" },
    { nit: "6", estado: "CANCELADA" },
    { nit: "7", estado: "ACTIVA" },
  ]);
});

test("should dedupe NITs and preserver existing order if no active one", () => {
  const mockData = [
    { nit: "1", estado: "CANCELADA", razon_social: "1a" },
    { nit: "1", estado: "CANCELADA", razon_social: "1b" },
    { nit: "1", estado: "CANCELADA", razon_social: "1c" },
    { nit: "2", estado: "CANCELADA", razon_social: "2a" },
    { nit: "2", estado: "CANCELADA", razon_social: "2b" },
    { nit: "2", estado: "CANCELADA", razon_social: "2c" },
    { nit: "3", estado: "CANCELADA", razon_social: "3a" },
    { nit: "3", estado: "CANCELADA", razon_social: "3b" },
    { nit: "3", estado: "CANCELADA", razon_social: "3c" },
  ];
  expect(dedupeResults(mockData)).toEqual([
    { nit: "1", estado: "CANCELADA", razon_social: "1a" },
    { nit: "2", estado: "CANCELADA", razon_social: "2a" },
    { nit: "3", estado: "CANCELADA", razon_social: "3a" },
  ]);
});
