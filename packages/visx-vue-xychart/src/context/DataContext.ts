import type { InjectionKey } from "vue";
import { inject } from "vue";
import type { DataContextType } from "../types/data";
import type { AxisScale } from "../types/axis";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyDataContext = DataContextType<AxisScale, AxisScale, any>;

/** Utilities for inferring context generics */
export type InferXScaleConfig<X extends AnyDataContext> =
  X extends DataContextType<infer T, any, any> ? T : AxisScale;

export type InferYScaleConfig<X extends AnyDataContext> =
  X extends DataContextType<any, infer T, any> ? T : AxisScale;

export type InferDatum<X extends AnyDataContext> =
  X extends DataContextType<any, any, infer T> ? T : any;

export type InferDataContext<C extends AnyDataContext = AnyDataContext> = DataContextType<
  InferXScaleConfig<C>,
  InferYScaleConfig<C>,
  InferDatum<C>
>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/** InjectionKey for DataContext — value is Partial because it starts empty before DataProvider populates it. */
export const DataContextKey: InjectionKey<Partial<InferDataContext>> = Symbol("DataContext");

/** Composable to inject DataContext. Returns a Partial context (empty {} if not provided). */
export function useDataContext() {
  return inject(DataContextKey, {} as Partial<InferDataContext>);
}
