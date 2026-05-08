import type { AxisScale } from "@visx-vue/axis";
import { shallowRef, triggerRef } from "vue";
import DataRegistry from "../classes/DataRegistry";
import type { DataContextType } from "../types";

/** Composable that returns an API equivalent to DataRegistry but which triggers Vue reactivity on updates. */
export default function useDataRegistry<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
>(): DataContextType<XScale, YScale, Datum>["dataRegistry"] {
  const registryRef = shallowRef(new DataRegistry<XScale, YScale, Datum>());

  return {
    registerData: (
      ...params: Parameters<DataContextType<XScale, YScale, Datum>["dataRegistry"]["registerData"]>
    ) => {
      registryRef.value.registerData(...params);
      triggerRef(registryRef);
    },
    unregisterData: (
      ...params: Parameters<
        DataContextType<XScale, YScale, Datum>["dataRegistry"]["unregisterData"]
      >
    ) => {
      registryRef.value.unregisterData(...params);
      triggerRef(registryRef);
    },
    entries: () => registryRef.value.entries(),
    get: (key: string) => registryRef.value.get(key),
    keys: () => registryRef.value.keys(),
  };
}
