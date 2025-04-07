/**
 * Format a string replacing underscores with spaces and
 * capitalizing the first letter.
 * @param strToFormat The string to format.
 * @returns The formatted title.
 */
export const formatTitle = (strToFormat: string): string => {
  return strToFormat
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const formatNumber = (num: number): string => {
  if (num === null || num === undefined) return "";
  return num.toLocaleString(
    "en-US", { useGrouping: true }
  );
}
