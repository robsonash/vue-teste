export function formatCurrency(value) {
  if (value !== undefined) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  return value;
}
