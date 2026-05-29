export interface DebounceSettings {
  /** Debounce time in ms. Default `300`. */
  debounceTime?: number
  /** Whether to call the debounce function on the leading edge. Default `true`. */
  enableDebounceLeadingCall?: boolean
}

export interface ResizeObserverPolyfill {
  new (callback: ResizeObserverCallback): ResizeObserver
}
