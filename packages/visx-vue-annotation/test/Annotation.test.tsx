import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, inject, type ComputedRef } from 'vue'
import { Annotation, AnnotationKey } from '../src'
import type { AnnotationContextType } from '../src'

describe('<Annotation />', () => {
  it('should be defined', () => {
    expect(Annotation).toBeDefined()
  })

  it('should provide AnnotationContext', () => {
    expect.assertions(1)
    const annotation = { x: -50, y: 100, dx: 1000, dy: 7 }

    const AnnotationChild = defineComponent({
      setup() {
        const ctx = inject<ComputedRef<AnnotationContextType>>(AnnotationKey)
        expect(ctx?.value).toEqual(annotation)
        return () => null
      }
    })

    mount(Annotation, {
      props: annotation,
      slots: {
        default: () => <AnnotationChild />
      }
    })
  })
})
