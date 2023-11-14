/**
 * Generic chunk array into arrs of at most n elements.
 *
 * @param arr
 * @param n
 * @returns
 */
export const chunk = <T>(arr: T[], n: number): T[][] => {
  return Array.from(Array(Math.ceil(arr.length / n)), (_, i) => arr.slice(i * n, i * n + n))
}
