import { ref } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { createTooltipInPortal } from './TooltipInPortal'
import type { UseTooltipPortalOptions } from './types'

export default function useTooltipInPortal(options: UseTooltipPortalOptions = {}) {
  const { detectBounds: detectBoundsOption = true, zIndex: zIndexOption } = options

  const containerRef = ref<HTMLElement | SVGElement | null>(null)
  const containerBounds = useElementBounding(containerRef)

  function forceRefreshBounds() {
    containerBounds.update()
  }

  const TooltipInPortal = createTooltipInPortal(detectBoundsOption, zIndexOption, containerBounds)

  return {
    containerRef,
    containerBounds,
    forceRefreshBounds,
    TooltipInPortal
  }
}
