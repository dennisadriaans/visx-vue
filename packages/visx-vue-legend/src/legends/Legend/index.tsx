import { defineComponent, useAttrs, useSlots, type CSSProperties, type PropType } from "vue";
import type { AnyD3Scale, ScaleInput } from "@visx-vue/scale";
import LegendItem from "./LegendItem";
import type { LegendLabelOwnProps } from "./LegendLabel";
import LegendLabel from "./LegendLabel";
import LegendShape from "./LegendShape";
import valueOrIdentity, { valueOrIdentityString } from "../../util/valueOrIdentity";
import labelTransformFactory from "../../util/labelTransformFactory";
import type {
  FlexDirection,
  FormattedLabel,
  LabelFormatter,
  LabelFormatterFactory,
  LegendShape as LegendShapeType,
  FillAccessor,
  SizeAccessor,
  ShapeStyleAccessor,
} from "../../types";

export type LegendProps<Scale extends AnyD3Scale> = {
  /** Classname to be applied to legend container. */
  className?: string;
  /** Styles to be applied to the legend container. */
  style?: CSSProperties;
  /** Legend domain. */
  domain?: ScaleInput<Scale>[];
  /** Width of the legend shape. */
  shapeWidth?: string | number;
  /** Height of the legend shape. */
  shapeHeight?: string | number;
  /** Margin of the legend shape. */
  shapeMargin?: string | number;
  /** Flex-box alignment of legend item labels. */
  labelAlign?: string;
  /** `@visx/scale` or `d3-scale` object used to generate the legend items. */
  scale: Scale;
  /** Flex-box flex of legend item labels. */
  labelFlex?: string | number;
  /** Margin of legend item labels. */
  labelMargin?: string | number;
  /** Margin of legend items. */
  itemMargin?: string | number;
  /** Flex direction of the legend itself. */
  direction?: FlexDirection;
  /** Flex direction of legend items. */
  itemDirection?: FlexDirection;
  /** Legend item fill accessor function. */
  fill?: FillAccessor<ScaleInput<Scale>, ReturnType<Scale>>;
  /** Legend item size accessor function. */
  size?: SizeAccessor<ScaleInput<Scale>, ReturnType<Scale>>;
  /** Legend shape string preset or Element or Component. */
  shape?: LegendShapeType<ScaleInput<Scale>, ReturnType<Scale>>;
  /** Styles applied to legend shapes. */
  shapeStyle?: ShapeStyleAccessor<ScaleInput<Scale>, ReturnType<Scale>>;
  /** Given a legend item and its index, returns an item label. */
  labelFormat?: LabelFormatter<ScaleInput<Scale>>;
  /** Given the legend scale and labelFormatter, returns a label with datum, index, value, and label. */
  labelTransform?: LabelFormatterFactory<Scale>;
  /** Additional props to be set on LegendLabel. */
  legendLabelProps?: Partial<LegendLabelOwnProps>;
};

const defaultStyle: CSSProperties = {
  display: "flex",
};

export const Legend = defineComponent({
  name: "Legend",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    style: { type: Object as PropType<CSSProperties>, default: () => defaultStyle },
    domain: { type: Array as PropType<any[]>, default: undefined },
    shapeWidth: { type: [String, Number] as PropType<string | number>, default: 15 },
    shapeHeight: { type: [String, Number] as PropType<string | number>, default: 15 },
    shapeMargin: { type: [String, Number] as PropType<string | number>, default: "2px 4px 2px 0" },
    labelAlign: { type: String as PropType<string>, default: "left" },
    scale: { type: [Object, Function] as PropType<AnyD3Scale>, required: true },
    labelFlex: { type: [String, Number] as PropType<string | number>, default: "1" },
    labelMargin: { type: [String, Number] as PropType<string | number>, default: "0 4px" },
    itemMargin: { type: [String, Number] as PropType<string | number>, default: "0" },
    direction: { type: String as PropType<FlexDirection>, default: "column" },
    itemDirection: { type: String as PropType<FlexDirection>, default: "row" },
    fill: { type: Function as PropType<FillAccessor<any, any>>, default: valueOrIdentityString },
    size: { type: Function as PropType<SizeAccessor<any, any>>, default: valueOrIdentityString },
    shape: {
      type: [String, Object, Function] as PropType<LegendShapeType<any, any>>,
      default: undefined,
    },
    shapeStyle: { type: Function as PropType<ShapeStyleAccessor<any, any>>, default: undefined },
    labelFormat: { type: Function as PropType<LabelFormatter<any>>, default: valueOrIdentity },
    labelTransform: {
      type: Function as PropType<LabelFormatterFactory<any>>,
      default: labelTransformFactory,
    },
    legendLabelProps: {
      type: Object as PropType<Partial<LegendLabelOwnProps>>,
      default: undefined,
    },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const domain = props.domain || ("domain" in props.scale ? (props.scale as any).domain() : []);
      const labelFormatter = props.labelTransform({
        scale: props.scale,
        labelFormat: props.labelFormat,
      });
      const labels: FormattedLabel<any, any>[] = domain.map(labelFormatter);

      if (slots.default) {
        return <>{slots.default({ labels })}</>;
      }

      return (
        <div
          class={["visx-legend", props.className]}
          style={{
            ...props.style,
            flexDirection: props.direction,
          }}
        >
          {labels.map((label, i) => (
            <LegendItem
              key={`legend-${label.text}-${i}`}
              margin={props.itemMargin}
              flexDirection={props.itemDirection}
              {...attrs}
            >
              {{
                default: () => (
                  <>
                    <LegendShape
                      shape={props.shape}
                      height={props.shapeHeight}
                      width={props.shapeWidth}
                      margin={props.shapeMargin}
                      item={domain[i]}
                      itemIndex={i}
                      label={label}
                      fill={props.fill}
                      size={props.size}
                      shapeStyle={props.shapeStyle}
                    />
                    <LegendLabel
                      label={label.text}
                      flex={props.labelFlex}
                      margin={props.labelMargin}
                      align={props.labelAlign}
                      {...props.legendLabelProps}
                    />
                  </>
                ),
              }}
            </LegendItem>
          ))}
        </div>
      );
    };
  },
});

export default Legend;
