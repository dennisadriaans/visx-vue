import { defineComponent, type PropType } from "vue";

export interface AnchorLineProps {
  anchorLineOrientation: "horizontal" | "vertical";
  verticalAnchor: "start" | "middle" | "end";
  horizontalAnchor: "start" | "middle" | "end" | "inherit";
  anchorLineStroke: string;
  width: number;
  height: number;
}

export const AnchorLine = defineComponent({
  name: "AnchorLine",
  props: {
    anchorLineOrientation: { type: String as PropType<"horizontal" | "vertical">, required: true },
    verticalAnchor: { type: String as PropType<"start" | "middle" | "end">, required: true },
    horizontalAnchor: {
      type: String as PropType<"start" | "middle" | "end" | "inherit">,
      required: true,
    },
    anchorLineStroke: { type: String as PropType<string>, required: true },
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
  },
  setup(props) {
    return () => {
      const backgroundOutline = { stroke: props.anchorLineStroke, "stroke-width": 2 };

      return (
        <>
          {props.anchorLineOrientation === "horizontal" && props.verticalAnchor === "start" && (
            <line {...backgroundOutline} x1={0} x2={props.width} y1={0} y2={0} />
          )}
          {props.anchorLineOrientation === "horizontal" && props.verticalAnchor === "end" && (
            <line
              {...backgroundOutline}
              x1={0}
              x2={props.width}
              y1={props.height}
              y2={props.height}
            />
          )}
          {props.anchorLineOrientation === "vertical" && props.horizontalAnchor === "start" && (
            <line {...backgroundOutline} x1={0} x2={0} y1={0} y2={props.height} />
          )}
          {props.anchorLineOrientation === "vertical" && props.horizontalAnchor === "end" && (
            <line
              {...backgroundOutline}
              x1={props.width}
              x2={props.width}
              y1={0}
              y2={props.height}
            />
          )}
        </>
      );
    };
  },
});

export default AnchorLine;
