export function capitalizeWords(input: string) {
  return input
    .toLowerCase()
    .split(/[_\s]+/) // handles snake_case or space-separated words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
