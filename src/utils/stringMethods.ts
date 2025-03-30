/**
 * Format a string replacing underscores with spaces and
 * capitalizing the first letter.
 * @param strToFormat The string to format.
 * @returns The formatted title.
 */
export const formatString = (strToFormat: string): string => {
  return strToFormat
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
