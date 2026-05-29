import { inject, onScopeDispose, ref } from 'vue'
import { localPoint } from '@visx-vue/event'
import { EventEmitterContextKey } from '../context/EventEmitterContext'

export type EventType =
  | 'pointermove'
  | 'pointerout'
  | 'pointerup'
  | 'pointerdown'
  | 'focus'
  | 'blur'

export type HandlerParams = {
  /** The PointerEvent or FocusEvent. */
  event: PointerEvent | FocusEvent
  /** Position of the PointerEvent in svg coordinates. */
  svgPoint: ReturnType<typeof localPoint>
  /** The source of the event. This can be anything, but for this package is the name of the component which emitted the event. */
  source?: string
}

export type Handler = (params?: HandlerParams) => void

/**
 * Composable for optionally subscribing to a specified EventType,
 * and returns emitter for emitting events.
 */
export default function useEventEmitter(
  /** Type of event to subscribe to. */
  eventType?: EventType,
  /** Handler invoked on emission of EventType event. */
  handler?: Handler,
  /** Optional valid sources for EventType subscription. */
  allowedSources?: string[]
) {
  const emitter = inject(EventEmitterContextKey, null)
  // use ref so allowedSources[] can change without creating new handlers
  const allowedSourcesRef = ref<string[] | undefined>(allowedSources)
  allowedSourcesRef.value = allowedSources

  // wrap emitter.emit so we can enforce stricter type signature
  function emit(type: EventType, event: HandlerParams['event'], source?: string) {
    if (emitter) {
      emitter.emit(type, { event, svgPoint: localPoint(event), source } as HandlerParams)
    }
  }

  if (emitter && eventType && handler) {
    const handlerWithSourceFilter: Handler = (params?: HandlerParams) => {
      if (
        !allowedSourcesRef.value ||
        (params?.source && allowedSourcesRef.value?.includes(params.source))
      ) {
        handler(params)
      }
    }

    emitter.on(eventType, handlerWithSourceFilter as (...args: unknown[]) => void)

    onScopeDispose(() => {
      emitter.off(eventType, handlerWithSourceFilter as (...args: unknown[]) => void)
    })
  }

  return emitter ? emit : null
}
