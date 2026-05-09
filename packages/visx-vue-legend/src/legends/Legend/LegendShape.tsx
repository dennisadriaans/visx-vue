import { defineComponent, type PropType } from "vue";
import RectShape from "../../shapes/Rect";
import renderShape from "../../util/renderShape";
import type {
  FillAccessor,
  FormattedLabel,
  LegendShape as LegendShapeType,
  SizeAccessor,
  ShapeStyleAccessor,
} from "../../types";

export type LegendShapeProps<Data, Output> = {
  /** The formatted label object containing datum, index, text, and optional value */
  label: FormattedLabel<Data, Output>;
  /** The data item for this legend entry */
  item: Data;
  /** The index of this item in the legend */
  itemIndex: number;
  /** Margin around the shape */
  margin?: string | number;
  /** The shape component or function to render. Defaults to ShapeRect if not provided. */
  shape?: LegendShapeType<Data, Output>;
  /** Accessor function for the fill color of the shape */
  fill?: FillAccessor<Data, Output>;
  /** Accessor function for the size of the shape */
  size?: SizeAccessor<Data, Output>;
  /** Accessor function for additional shape styling */
  shapeStyle?: ShapeStyleAccessor<Data, Output>;
  /** Width of the shape container */
  width?: string | number;
  /** Height of the shape container */
  height?: string | number;
};

export const LegendShape = defineComponent({
  name: "LegendShape",
  props: {
    label: { type: Object as PropType<FormattedLabel<any, any>>, required: true },
    item: { type: null as unknown as PropType<any>, required: true },
    itemIndex: { type: Number as PropType<number>, required: true },
    margin: { type: [String, Number] as PropType<string | number>, default: undefined },
    shape: {
      type: [String, Object, Function] as PropType<LegendShapeType<any, any>>,
      default: () => RectShape,
    },
    fill: { type: Function as PropType<FillAccessor<any, any>>, default: undefined },
    size: { type: Function as PropType<SizeAccessor<any, any>>, default: undefined },
    shapeStyle: { type: Function as PropType<ShapeStyleAccessor<any, any>>, default: undefined },
    width: { type: [String, Number] as PropType<string | number>, default: undefined },
    height: { type: [String, Number] as PropType<string | number>, default: undefined },
  },
  setup(props) {
    return () => (
      <div
        class="visx-legend-shape"
        style={{
          display: "flex",
          width: props.size ? props.size({ ...props.label }) : props.width,
          height: props.size ? props.size({ ...props.label }) : props.height,
          margin: props.margin,
        }}
      >
        {renderShape({
          shape: props.shape,
          item: props.item,
          itemIndex: props.itemIndex,
          label: props.label,
          width: props.width,
          height: props.height,
          fill: props.fill,
          shapeStyle: props.shapeStyle,
        })}
      </div>
    );
  },
});

export default LegendShape;
