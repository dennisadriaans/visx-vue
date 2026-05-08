import type { InjectionKey } from "vue";
import { inject } from "vue";
import type { EventEmitterContextType } from "../types/event";

/** InjectionKey for EventEmitterContext. */
export const EventEmitterContextKey: InjectionKey<EventEmitterContextType> =
  Symbol("EventEmitterContext");

/** Composable to inject EventEmitterContext. Returns null if not provided. */
export function useEventEmitterContext() {
  return inject(EventEmitterContextKey, null);
}
