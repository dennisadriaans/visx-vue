import { defineComponent, useAttrs, useSlots, Teleport } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import type { UseElementBoundingReturn } from '@vueuse/core'
import { Tooltip } from './Tooltip'
import { TooltipWithBounds } from './TooltipWithBounds'

export function createTooltipInPortal(
  detectBoundsOption: boolean,
  zIndexOption: number | string | undefined,
  containerBounds: UseElementBoundingReturn
) {
  return defineComponent({
    name: 'TooltipInPortal',
    inheritAttrs: false,
    props: {
      left: { type: Number as PropType<number>, default: 0 },
      top: { type: Number as PropType<number>, default: 0 },
      className: { type: String as PropType<string>, default: undefined },
      offsetLeft: { type: Number as PropType<number>, default: 10 },
      offsetTop: { type: Number as PropType<number>, default: 10 },
      style: { type: Object as PropType<CSSProperties>, default: undefined },
      unstyled: { type: Boolean as PropType<boolean>, default: false },
      applyPositionStyle: { type: Boolean as PropType<boolean>, default: false },
      detectBounds: { type: Boolean as PropType<boolean>, default: undefined },
      zIndex: { type: [Number, String] as PropType<number | string>, default: undefined }
    },
    setup(tooltipProps) {
      const attrs = useAttrs()
      const slots = useSlots()

      return () => {
        const detectBounds = tooltipProps.detectBounds ?? detectBoundsOption
        const zIndex = tooltipProps.zIndex ?? zIndexOption
        const TooltipComponent = detectBounds ? TooltipWithBounds : Tooltip

        const scrollX = typeof window !== 'undefined' ? window.scrollX : 0
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
        const portalLeft = (tooltipProps.left ?? 0) + (containerBounds.left.value || 0) + scrollX
        const portalTop = (tooltipProps.top ?? 0) + (containerBounds.top.value || 0) + scrollY

        const portalStyle: CSSProperties | undefined =
          zIndex != null ? { position: 'absolute' as const, zIndex } : undefined

        return (
          <Teleport to="body">
            {portalStyle ? (
              <div style={portalStyle}>
                <TooltipComponent
                  left={portalLeft}
                  top={portalTop}
                  className={
                    ['visx-tooltip-portal', tooltipProps.className].filter(Boolean).join(' ') ||
                    undefined
                  }
                  offsetLeft={tooltipProps.offsetLeft}
                  offsetTop={tooltipProps.offsetTop}
                  style={tooltipProps.style}
                  unstyled={tooltipProps.unstyled}
                  applyPositionStyle={tooltipProps.applyPositionStyle}
                  {...attrs}
                >
                  {slots.default?.()}
                </TooltipComponent>
              </div>
            ) : (
              <TooltipComponent
                left={portalLeft}
                top={portalTop}
                className={
                  ['visx-tooltip-portal', tooltipProps.className].filter(Boolean).join(' ') ||
                  undefined
                }
                offsetLeft={tooltipProps.offsetLeft}
                offsetTop={tooltipProps.offsetTop}
                style={tooltipProps.style}
                unstyled={tooltipProps.unstyled}
                applyPositionStyle={tooltipProps.applyPositionStyle}
                {...attrs}
              >
                {slots.default?.()}
              </TooltipComponent>
            )}
          </Teleport>
        )
      }
    }
  })
}
