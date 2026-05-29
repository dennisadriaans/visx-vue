import { provide, inject, computed } from 'vue'
import type { InjectionKey, ComputedRef, Ref } from 'vue'
import type { TooltipPositionContextType } from './types'

const TooltipPositionKey: InjectionKey<
  ComputedRef<TooltipPositionContextType> | Ref<TooltipPositionContextType>
> = Symbol('TooltipPosition')

const defaultValue: TooltipPositionContextType = {
  isFlippedVertically: false,
  isFlippedHorizontally: false
}

export function provideTooltipPosition(
  value: ComputedRef<TooltipPositionContextType> | Ref<TooltipPositionContextType>
) {
  provide(TooltipPositionKey, value)
}

export function useTooltipPosition(): ComputedRef<TooltipPositionContextType> {
  const injected = inject(TooltipPositionKey, undefined)
  if (injected) return injected as ComputedRef<TooltipPositionContextType>
  return computed(() => defaultValue)
}
