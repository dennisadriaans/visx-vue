/**
 * Simple debounce with leading-edge support.
 * Replaces lodash/debounce used by the React original.
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
  options: { leading?: boolean } = {}
): ((...args: Args) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Args) => {
    const callLeading = options.leading && timeoutId === null

    if (timeoutId !== null) clearTimeout(timeoutId)

    if (callLeading) {
      fn(...args)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}
