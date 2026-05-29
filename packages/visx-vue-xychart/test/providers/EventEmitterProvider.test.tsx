// @vitest-environment jsdom
import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import EventEmitterProvider from '../../src/providers/EventEmitterProvider'
import { useEventEmitterContext } from '../../src/context/EventEmitterContext'

describe('<EventEmitterProvider />', () => {
  it('should be defined', () => {
    expect(EventEmitterProvider).toBeDefined()
  })

  it('should provide an emitter for subscribing and emitting events', () => {
    expect.assertions(1)

    const EventEmitterConsumer = defineComponent({
      setup() {
        const emitter = useEventEmitterContext()
        expect(emitter).toMatchObject({ on: expect.any(Function), emit: expect.any(Function) })
        return () => null
      }
    })

    mount(EventEmitterProvider, {
      slots: {
        default: () => <EventEmitterConsumer />
      }
    })
  })
})
