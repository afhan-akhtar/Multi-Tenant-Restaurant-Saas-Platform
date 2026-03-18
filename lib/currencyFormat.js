const CURRENCY_NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEur(value) {
  return `€${CURRENCY_NUMBER_FORMATTER.format(Number(value || 0))}`;
}
