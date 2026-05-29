import type { CSSProperties, Ref } from 'vue'

export type UseTooltipParams<TooltipData> = {
  /** Whether the tooltip is currently open/visible. */
  tooltipOpen: Ref<boolean>
  /** The left position (in pixels) of the tooltip. */
  tooltipLeft: Ref<number | undefined>
  /** The top position (in pixels) of the tooltip. */
  tooltipTop: Ref<number | undefined>
  /** The data associated with the tooltip. */
  tooltipData: Ref<TooltipData | undefined>
  /** Function to update tooltip state. */
  updateTooltip: (args: UpdateTooltipArgs<TooltipData>) => void
  /** Function to show the tooltip with the specified position and data. */
  showTooltip: (args: ShowTooltipArgs<TooltipData>) => void
  /** Function to hide the tooltip. */
  hideTooltip: () => void
}

export type UseTooltipState<TooltipData> = {
  tooltipOpen: boolean
  tooltipLeft?: number
  tooltipTop?: number
  tooltipData?: TooltipData
}

export type ValueOrFunc<T> = T | ((t: T) => T)
export type ShowTooltipArgs<TooltipData> = ValueOrFunc<
  Omit<UseTooltipState<TooltipData>, 'tooltipOpen'>
>
export type UpdateTooltipArgs<TooltipData> = ValueOrFunc<UseTooltipState<TooltipData>>

export type TooltipProps = {
  /** Optional className to apply to the Tooltip in addition to `visx-tooltip`. */
  className?: string
  /** The `left` position of the Tooltip. */
  left?: number
  /** Offset the `left` position of the Tooltip by this margin. */
  offsetLeft?: number
  /** Offset the `top` position of the Tooltip by this margin. */
  offsetTop?: number
  /** Styles to apply, unless `unstyled=true`. */
  style?: CSSProperties
  /** The `top` position of the Tooltip. */
  top?: number
  /**
   * Applies position: 'absolute' for tooltips to correctly position themselves
   * when `unstyled=true`. In a future major release this will be the default behavior.
   */
  applyPositionStyle?: boolean
  /**
   * Whether to omit applying any style, except `left` / `top`.
   * In most cases if this is `true` a developer must do one of the following
   * for positioning to work correctly:
   * - set `applyPositionStyle=true`
   * - create a CSS selector like: `.visx-tooltip { position: 'absolute' }`
   */
  unstyled?: boolean
}

export type TooltipWithBoundsProps = TooltipProps

export type TooltipPositionContextType = {
  isFlippedVertically: boolean
  isFlippedHorizontally: boolean
}

export type TooltipInPortalProps = TooltipProps & {
  /** Whether to use TooltipWithBounds for auto-detecting boundaries. */
  detectBounds?: boolean
  /** Optional z-index to set on the portal container. */
  zIndex?: number | string
}

export type UseTooltipPortalOptions = {
  /** Whether TooltipWithBounds should be used to auto-detect (page) boundaries and reposition itself. */
  detectBounds?: boolean
  /** Optional z-index to set on the portal container. */
  zIndex?: number | string
}

export type UseTooltipInPortal = {
  /** Ref to be attached to the container element for boundary detection. */
  containerRef: import('vue').Ref<HTMLElement | SVGElement | null>
  /** The bounding box of the container element. */
  containerBounds: {
    left: import('vue').Ref<number>
    top: import('vue').Ref<number>
    width: import('vue').Ref<number>
    height: import('vue').Ref<number>
    right: import('vue').Ref<number>
    bottom: import('vue').Ref<number>
    x: import('vue').Ref<number>
    y: import('vue').Ref<number>
    update: () => void
  }
  /** Function to force a refresh of the container bounds. */
  forceRefreshBounds: () => void
  /** Component to render the tooltip in a portal. */
  TooltipInPortal: import('vue').Component
}
