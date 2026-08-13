const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** O backend devolve decimais como string ("150.00"), entao aceita os dois. */
export function formatCurrency(value: string | number | null): string {
  if (value === null) return "";

  const amount = typeof value === "string" ? Number(value) : value;

  return Number.isFinite(amount) ? BRL.format(amount) : "";
}
