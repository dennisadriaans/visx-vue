import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'
import { useParentSize } from './useParentSize'
import type { ParentSizeState } from './useParentSize'
import type { ResizeObserverPolyfill } from './types'

export type ParentSizeProvidedProps = ParentSizeState & {
  ref: HTMLDivElement | null
  resize: (state: ParentSizeState) => void
}

export interface ParentSizeProps {
  /** Optional `className` to add to the parent `div` wrapper used for size measurement. */
  className?: string
  /**
   * @deprecated - use `style` prop as all other props are passed directly to the parent `div`.
   * Optional `style` object to apply to the parent `div` wrapper used for size measurement.
   */
  parentSizeStyles?: Record<string, string>
  /** Initial size before measuring the parent. */
  initialSize?: Partial<ParentSizeState>
  /** Debounce time in ms. Default `300`. */
  debounceTime?: number
  /** Optional dimensions provided won't trigger a state change when changed. */
  ignoreDimensions?: keyof ParentSizeState | (keyof ParentSizeState)[]
  /** Whether to call the debounce function on the leading edge. Default `true`. */
  enableDebounceLeadingCall?: boolean
  /** Optionally inject a ResizeObserver polyfill. */
  resizeObserverPolyfill?: ResizeObserverPolyfill
}

const defaultParentSizeStyles: Record<string, string> = { width: '100%', height: '100%' }

export const ParentSize = defineComponent({
  name: 'ParentSize',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    parentSizeStyles: {
      type: Object as PropType<Record<string, string>>,
      default: () => defaultParentSizeStyles
    },
    initialSize: { type: Object as PropType<Partial<ParentSizeState>>, default: undefined },
    debounceTime: { type: Number as PropType<number>, default: undefined },
    ignoreDimensions: {
      type: [String, Array] as PropType<keyof ParentSizeState | (keyof ParentSizeState)[]>,
      default: undefined
    },
    enableDebounceLeadingCall: { type: Boolean as PropType<boolean>, default: true },
    resizeObserverPolyfill: {
      type: Function as unknown as PropType<ResizeObserverPolyfill>,
      default: undefined
    }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    const { parentRef, resize, width, height, top, left } = useParentSize({
      initialSize: props.initialSize,
      debounceTime: props.debounceTime,
      ignoreDimensions: props.ignoreDimensions,
      enableDebounceLeadingCall: props.enableDebounceLeadingCall,
      resizeObserverPolyfill: props.resizeObserverPolyfill
    })

    return () => (
      <div
        style={props.parentSizeStyles}
        ref={parentRef}
        class={props.className}
        {...attrs}
      >
        {slots.default?.({
          width: width.value,
          height: height.value,
          top: top.value,
          left: left.value,
          ref: parentRef.value,
          resize
        })}
      </div>
    )
  }
})
