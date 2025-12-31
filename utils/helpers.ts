
/**
 * Converts Arabic (٠١٢٣٤٥٦٧٨٩) and Persian (۰۱۲۳۴۵۶۷۸۹) numerals to standard English digits.
 */
export const toEnglishDigits = (str: string | number | undefined): string => {
  if (typeof str === 'number') return str.toString();
  if (!str) return "";
  return str
    .replace(/[٠-٩]/g, (d) => (d.charCodeAt(0) - 1632).toString())
    .replace(/[۰-۹]/g, (d) => (d.charCodeAt(0) - 1776).toString());
};

/**
 * Safely parses a string that may contain mixed Arabic or English digits into a valid number.
 */
export const parseArabicNumber = (val: string | number | undefined): number => {
  if (typeof val === 'number') return val;
  const normalized = toEnglishDigits(val);
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
};
