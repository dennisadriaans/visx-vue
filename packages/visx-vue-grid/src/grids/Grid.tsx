import { defineComponent, useAttrs, type PropType, type CSSProperties } from 'vue'
import { Group } from '@visx-vue/group'
import type { ScaleInput } from '@visx-vue/scale'
import GridRows from './GridRows'
import type { AllGridRowsProps } from './GridRows'
import GridColumns from './GridColumns'
import type { AllGridColumnsProps } from './GridColumns'
import type { CommonGridProps, GridScale } from '../types'

type CommonPropsToOmit =
  | 'scale'
  | 'offset'
  | 'numTicks'
  | 'lineStyle'
  | 'tickValues'
  | 'from'
  | 'to'
  | 'children'

export type GridProps<XScale extends GridScale, YScale extends GridScale> = Omit<
  AllGridRowsProps<YScale> & AllGridColumnsProps<XScale>,
  CommonPropsToOmit
> & {
  /** `@visx/scale` or `d3-scale` object used to map from ScaleInput to x-coordinates (GridColumns). */
  xScale: XScale
  /** `@visx/scale` or `d3-scale` object used to map from ScaleInput to y-coordinates (GridRows). */
  yScale: YScale
  /** Pixel offset to apply as an x-translation to each GridColumns line. */
  xOffset?: CommonGridProps['offset']
  /** Pixel offset to apply as an y-translation to each GridRows line. */
  yOffset?: CommonGridProps['offset']
  /** Approximate number of row gridlines. */
  numTicksRows?: CommonGridProps['numTicks']
  /** Approximate number of column gridlines. */
  numTicksColumns?: CommonGridProps['numTicks']
  /** Style object to apply to GridRows. */
  rowLineStyle?: CommonGridProps['lineStyle']
  /** Style object to apply to GridColumns. */
  columnLineStyle?: CommonGridProps['lineStyle']
  /** Exact values to be used for GridRows lines, passed to yScale. */
  rowTickValues?: ScaleInput<YScale>[]
  /** Exact values to be used for GridColumns lines, passed to xScale. */
  columnTickValues?: ScaleInput<XScale>[]
}

export const Grid = defineComponent({
  name: 'Grid',
  inheritAttrs: false,
  props: {
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    xScale: { type: Function as PropType<GridScale>, required: true },
    yScale: { type: Function as PropType<GridScale>, required: true },
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
    className: { type: String as PropType<string>, default: undefined },
    stroke: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    strokeDasharray: { type: String as PropType<string>, default: undefined },
    numTicksRows: { type: Number as PropType<number>, default: undefined },
    numTicksColumns: { type: Number as PropType<number>, default: undefined },
    rowLineStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    columnLineStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    xOffset: { type: Number as PropType<number>, default: undefined },
    yOffset: { type: Number as PropType<number>, default: undefined },
    rowTickValues: { type: Array as PropType<unknown[]>, default: undefined },
    columnTickValues: { type: Array as PropType<unknown[]>, default: undefined }
  },
  setup(props) {
    const attrs = useAttrs()

    return () => (
      <Group
        className={['visx-grid', props.className].filter(Boolean).join(' ')}
        top={props.top}
        left={props.left}
      >
        {{
          default: () => [
            <GridRows
              className={props.className}
              scale={props.yScale}
              width={props.width}
              stroke={props.stroke}
              strokeWidth={props.strokeWidth}
              strokeDasharray={props.strokeDasharray}
              numTicks={props.numTicksRows}
              lineStyle={props.rowLineStyle}
              offset={props.yOffset}
              tickValues={props.rowTickValues}
              {...attrs}
            />,
            <GridColumns
              className={props.className}
              scale={props.xScale}
              height={props.height}
              stroke={props.stroke}
              strokeWidth={props.strokeWidth}
              strokeDasharray={props.strokeDasharray}
              numTicks={props.numTicksColumns}
              lineStyle={props.columnLineStyle}
              offset={props.xOffset}
              tickValues={props.columnTickValues}
              {...attrs}
            />
          ]
        }}
      </Group>
    )
  }
})

export default Grid
