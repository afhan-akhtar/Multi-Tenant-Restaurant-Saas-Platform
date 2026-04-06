/** Digits only — used for storage, matching, and duplicate checks (like POS/CRM systems). */
export function normalizeCustomerPhone(input) {
  return String(input ?? "").replace(/\D/g, "");
}

const MIN_DIGITS = 7;
const MAX_DIGITS = 15;

export function isValidCustomerPhoneDigits(digits) {
  return digits.length >= MIN_DIGITS && digits.length <= MAX_DIGITS;
}

/** Readable grouping (e.g. 923001234567 → 923 001 234 567) for default display name. */
export function formatPhoneDigitsForDisplay(digits) {
  const d = normalizeCustomerPhone(digits);
  if (!d) return "";
  let s = d;
  const parts = [];
  while (s.length > 4) {
    parts.unshift(s.slice(-3));
    s = s.slice(0, -3);
  }
  if (s.length) parts.unshift(s);
  return parts.join(" ");
}

/**
 * Stored `name`: optional label; if omitted, use formatted phone (professional “number = account” UX).
 */
export function resolveCustomerName({ name, phoneDigits }) {
  const trimmed = String(name ?? "").trim();
  if (trimmed.length > 0) return trimmed;
  return formatPhoneDigitsForDisplay(phoneDigits) || "Customer";
}

export function guestEmailForPhone(phoneDigits) {
  const d = normalizeCustomerPhone(phoneDigits);
  return `+${d}@phone.guest.local`;
}

/** POS / KDS / loyalty: show phone, or Guest / Walk-in when internal walk-in row. */
export function customerPhoneUiLabel(customer) {
  if (!customer) return "Guest / Walk-in";
  const isWalkIn =
    String(customer.email || "").toLowerCase() === "walkin@internal.local" || customer.name === "Walk-in";
  if (isWalkIn && !customer.phone) return "Guest / Walk-in";
  return formatPhoneDigitsForDisplay(customer.phone) || customer.phone || "—";
}
