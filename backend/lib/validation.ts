export function isValidYear(value: any) {
  const year = Number(value);
  if (!Number.isFinite(year)) return false;
  const min = 1900;
  const max = new Date().getFullYear() + 1; // allow next-year listings
  return year >= min && year <= max;
}

export function isPositivePrice(value: any) {
  const price = Number(value);
  return Number.isFinite(price) && price > 0;
}

export function isValidEmail(value: any) {
  if (!value || typeof value !== 'string') return false;
  // simple RFC-lite email check
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

export function isNonEmptyString(value: any) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidPhone(value: any) {
  if (!value || typeof value !== 'string') return false;
  // simple Pakistan phone regex (optional +92) or local 03xx format
  return /^(?:\+92|0)?3\d{2}\d{7}$/.test(value.replace(/\s|-/g, ''));
}

// Small sample list of known makes/models — expand as needed or load from config
const KNOWN_MAKES = ["Toyota", "Honda", "Suzuki", "Hyundai", "Kia", "BMW", "Mercedes"];
export function isKnownMake(value: any) {
  if (!isNonEmptyString(value)) return false;
  return KNOWN_MAKES.includes(String(value));
}

// For models, we do a loose check (non-empty) — you can add per-make lists if needed
export function isKnownModel(value: any) {
  return isNonEmptyString(value);
}
