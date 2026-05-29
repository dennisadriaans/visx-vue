import { type VNode } from 'vue'
import { Line } from '@visx-vue/shape'
import { Text } from '@visx-vue/text'
import type { TextProps } from '@visx-vue/text'
import getLabelTransform from '../utils/getLabelTransform'
import Orientation from '../constants/orientation'
import type { AxisRendererProps, AxisScale } from '../types'
import Ticks from './Ticks'

const defaultTextProps: Partial<TextProps> = {
  textAnchor: 'middle',
  fontFamily: 'Arial',
  fontSize: 10,
  fill: '#222'
}

export default function AxisRenderer<Scale extends AxisScale>({
  axisFromPoint,
  axisLineClassName,
  axisToPoint,
  hideAxisLine,
  hideTicks,
  horizontal,
  label = '',
  labelClassName,
  labelOffset = 14,
  labelProps,
  orientation = Orientation.bottom,
  scale,
  stroke = '#222',
  strokeDasharray,
  strokeWidth = 1,
  tickClassName,
  tickComponent,
  tickLineProps,
  tickLabelProps,
  tickLength = 8,
  tickStroke = '#222',
  tickTransform,
  ticks,
  ticksComponent = Ticks
}: AxisRendererProps<Scale>): VNode[] {
  const combinedLabelProps = {
    ...defaultTextProps,
    ...labelProps
  }
  const tickLabelPropsDefault = {
    ...defaultTextProps,
    ...(typeof tickLabelProps === 'object' ? tickLabelProps : null)
  }
  // compute the max tick label size to compute label offset
  const allTickLabelProps = ticks.map(({ value, index }) =>
    typeof tickLabelProps === 'function'
      ? tickLabelProps(value, index, ticks)
      : tickLabelPropsDefault
  )
  const maxTickLabelFontSize = Math.max(
    10,
    ...allTickLabelProps.map((props) => (typeof props.fontSize === 'number' ? props.fontSize : 0))
  )
  return [
    ticksComponent({
      hideTicks,
      horizontal,
      orientation,
      scale,
      tickClassName,
      tickComponent,
      tickLabelProps: allTickLabelProps,
      tickStroke,
      tickTransform,
      ticks,
      strokeWidth,
      tickLineProps
    }),

    !hideAxisLine && (
      <Line
        className={['visx-axis-line', axisLineClassName].filter(Boolean).join(' ')}
        from={axisFromPoint}
        to={axisToPoint}
        {...{ stroke, 'stroke-width': strokeWidth, 'stroke-dasharray': strokeDasharray }}
      />
    ),

    label && (
      <Text
        className={['visx-axis-label', labelClassName].filter(Boolean).join(' ')}
        {...getLabelTransform({
          labelOffset,
          labelProps: combinedLabelProps,
          orientation,
          range: scale.range(),
          tickLabelFontSize: maxTickLabelFontSize,
          tickLength
        })}
        {...combinedLabelProps}
        text={label}
      />
    )
  ].filter(Boolean) as VNode[]
}
