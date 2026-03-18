const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatDate(value) {
  if (!value) {
    return "—";
  }

  return DATE_FORMATTER.format(new Date(value));
}
