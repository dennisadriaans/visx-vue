import type { InjectionKey } from 'vue'
import { inject } from 'vue'
import type { TooltipContextType } from '../types/tooltip'

/** InjectionKey for TooltipContext. */
export const TooltipContextKey: InjectionKey<TooltipContextType<object> | null> =
  Symbol('TooltipContext')

/** Composable to inject TooltipContext. Returns null if not provided. */
export function useTooltipContext<Datum extends object = object>() {
  return inject(TooltipContextKey, null) as TooltipContextType<Datum> | null
}
