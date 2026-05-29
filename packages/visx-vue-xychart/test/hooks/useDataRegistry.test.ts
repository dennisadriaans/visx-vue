// @vitest-environment jsdom
import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import useDataRegistry from '../../src/hooks/useDataRegistry'

describe('useDataRegistry', () => {
  it('should be defined', () => {
    expect(useDataRegistry).toBeDefined()
  })

  it('should provide a DataRegistry', () => {
    expect.assertions(1)

    const RegistryConsumer = defineComponent({
      setup() {
        const registry = useDataRegistry()
        expect(registry).toBeDefined()
        return () => null
      }
    })

    mount(RegistryConsumer)
  })
})
