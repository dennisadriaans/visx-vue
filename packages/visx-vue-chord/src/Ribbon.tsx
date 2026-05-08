import { defineComponent, useAttrs, useSlots, type PropType } from "vue";
import type { Chord, ChordSubgroup } from "d3-chord";
import { ribbon as d3ribbon } from "d3-chord";

type NumAccessor = (d: ChordSubgroup) => number;

export type RibbonProps = {
  /** Chord for which to render a ribbon. */
  chord: Chord;
  /** Sets the source accessor (defaults to chord.source). */
  source?: (d: Chord) => ChordSubgroup;
  /** Sets the target accessor (defaults to chord.source). */
  target?: (d: Chord) => ChordSubgroup;
  /** Sets the radius or radius accessor for the ribbon generator. */
  radius?: number | NumAccessor;
  /** Sets the start angle or start angle accessor for the ribbon generator. */
  startAngle?: number | NumAccessor;
  /** Sets the end angle or end angle accessor for the ribbon generator. */
  endAngle?: number | NumAccessor;
  /** Classname to apply to the rendered `<path />`. */
  className?: string;
};

export type RibbonSlotProps = {
  path: string | null;
};

/** This is a workaround for TypeScript not inferring the correct method overload */
function setNumberOrNumberAccessor(
  func: (d: number | NumAccessor) => void,
  value: number | NumAccessor,
) {
  if (typeof value === "number") func(value);
  else func(value);
}

export const Ribbon = defineComponent({
  name: "Ribbon",
  inheritAttrs: false,
  props: {
    chord: { type: Object as PropType<Chord>, required: true as const },
    source: { type: Function as PropType<(d: Chord) => ChordSubgroup>, default: undefined },
    target: { type: Function as PropType<(d: Chord) => ChordSubgroup>, default: undefined },
    radius: { type: [Number, Function] as PropType<number | NumAccessor>, default: undefined },
    startAngle: { type: [Number, Function] as PropType<number | NumAccessor>, default: undefined },
    endAngle: { type: [Number, Function] as PropType<number | NumAccessor>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const ribbon = d3ribbon<unknown, Chord, ChordSubgroup>();
      if (props.source) ribbon.source(props.source);
      if (props.target) ribbon.target(props.target);
      if (props.radius) setNumberOrNumberAccessor(ribbon.radius, props.radius);
      if (props.startAngle) setNumberOrNumberAccessor(ribbon.startAngle, props.startAngle);
      if (props.endAngle) setNumberOrNumberAccessor(ribbon.endAngle, props.endAngle);
      const path = ribbon(props.chord) as unknown as string | null;
      if (slots.default) return slots.default({ path });
      return <path class={["visx-ribbon", props.className]} d={path || ""} {...attrs} />;
    };
  },
});
