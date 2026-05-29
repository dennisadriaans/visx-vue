import { provide, inject, computed } from 'vue'
import type { InjectionKey, ComputedRef } from 'vue'
import type { AnnotationContextType } from './types'

export const AnnotationKey: InjectionKey<ComputedRef<AnnotationContextType>> =
  Symbol('AnnotationContext')

const EMPTY_CONTEXT: AnnotationContextType = {}
const defaultContext = computed<AnnotationContextType>(() => EMPTY_CONTEXT)

export function provideAnnotationContext(value: ComputedRef<AnnotationContextType>) {
  provide(AnnotationKey, value)
}

export function useAnnotationContext(): ComputedRef<AnnotationContextType> {
  return inject(AnnotationKey, defaultContext)
}
