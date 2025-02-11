export const numberFormatter = new Intl.NumberFormat("es-CO", {
  useGrouping: true,
});

export const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
});
