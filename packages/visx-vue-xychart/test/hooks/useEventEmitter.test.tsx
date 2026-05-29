// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, onMounted } from 'vue'
import useEventEmitter from '../../src/hooks/useEventEmitter'
import EventEmitterProvider from '../../src/providers/EventEmitterProvider'

// Create a properly formed PointerEvent with a target
const getEvent = (eventType: string) => {
  const svg = document.querySelector('svg') || document.createElement('svg')
  const event = new PointerEvent(eventType, {
    bubbles: true,
    clientX: 50,
    clientY: 50
  })
  Object.defineProperty(event, 'target', {
    value: svg,
    enumerable: true
  })
  return event
}

describe('useEventEmitter', () => {
  it('should be defined', () => {
    expect(useEventEmitter).toBeDefined()
  })

  it('should provide an emitter', () => {
    expect.assertions(1)

    const Component = defineComponent({
      setup() {
        const emitter = useEventEmitter()
        expect(emitter).toEqual(expect.any(Function))
        return () => null
      }
    })

    mount(EventEmitterProvider, {
      slots: {
        default: () => <Component />
      }
    })
  })

  it('should register event listeners and emit events', async () => {
    expect.assertions(1)

    const listener = vi.fn()

    const Component = defineComponent({
      setup() {
        const emit = useEventEmitter('pointermove', listener)

        onMounted(() => {
          if (emit) {
            emit('pointermove', getEvent('pointermove'))
          }
        })

        return () => null
      }
    })

    mount(EventEmitterProvider, {
      slots: {
        default: () => <Component />
      }
    })

    await flushPromises()
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should filter invalid sources if specified', async () => {
    expect.assertions(2)

    const eventType = 'pointermove'
    const sourceId = 'sourceId'
    const listener = vi.fn()
    const filteredListener = vi.fn()

    const Component = defineComponent({
      setup() {
        const emit = useEventEmitter()
        useEventEmitter('pointermove', listener)
        useEventEmitter('pointermove', filteredListener, [sourceId])

        onMounted(() => {
          if (emit) {
            emit(eventType, getEvent(eventType))
            emit(eventType, getEvent(eventType), sourceId)
          }
        })

        return () => null
      }
    })

    mount(EventEmitterProvider, {
      slots: {
        default: () => <Component />
      }
    })

    await flushPromises()
    // listener receives all events (no filter)
    expect(listener).toHaveBeenCalledTimes(2)
    // filteredListener only receives events with matching sourceId
    expect(filteredListener).toHaveBeenCalledTimes(1)
  })
})
