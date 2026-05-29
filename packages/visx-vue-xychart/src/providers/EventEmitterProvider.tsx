import { defineComponent, provide } from 'vue'
import mitt from 'mitt'
import { EventEmitterContextKey } from '../context/EventEmitterContext'

/** Provider for EventEmitterContext. */
const EventEmitterProvider = defineComponent({
  name: 'EventEmitterProvider',
  setup(_, { slots }) {
    const emitter = mitt()
    provide(EventEmitterContextKey, emitter)
    return () => slots.default?.()
  }
})

export default EventEmitterProvider
