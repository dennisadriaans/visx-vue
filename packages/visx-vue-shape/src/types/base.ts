import type { D3Scale, PickD3Scale } from "@visx-vue/scale";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type $TSFIXME = any;

export type DatumObject = Record<string | number, $TSFIXME>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyScaleBand = PickD3Scale<"band", any, any>;

/** A catch-all type for scales that returns number */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PositionScale = D3Scale<number, any, any>;
