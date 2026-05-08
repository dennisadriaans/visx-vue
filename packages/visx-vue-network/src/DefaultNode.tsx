import { defineComponent, useAttrs, type PropType } from "vue";

export type DefaultNodeProps = {
  cx?: number;
  cy?: number;
  node?: unknown;
};

export const DefaultNode = defineComponent({
  name: "DefaultNode",
  inheritAttrs: false,
  props: {
    r: { type: Number as PropType<number>, default: 15 },
    fill: { type: String as PropType<string>, default: "#21D4FD" },
    cx: { type: Number as PropType<number>, default: undefined },
    cy: { type: Number as PropType<number>, default: undefined },
    node: { type: null as unknown as PropType<unknown>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();

    return () => <circle r={props.r} fill={props.fill} cx={props.cx} cy={props.cy} {...attrs} />;
  },
});

export default DefaultNode;
