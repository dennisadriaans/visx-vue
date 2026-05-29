import type { VNode } from 'vue'
import { Line } from '@visx-vue/shape'
import { Group } from '@visx-vue/group'
import { Text } from '@visx-vue/text'

import Orientation from '../constants/orientation'
import type { TicksRendererProps, AxisScale } from '../types'

export default function Ticks<Scale extends AxisScale>({
  hideTicks,
  horizontal,
  orientation,
  tickClassName,
  tickComponent,
  tickLabelProps: allTickLabelProps,
  tickStroke = '#222',
  tickTransform,
  ticks,
  strokeWidth,
  tickLineProps
}: TicksRendererProps<Scale>): VNode[] {
  return ticks.map(({ value, index, from, to, formattedValue }) => {
    const tickLabelProps = allTickLabelProps[index] ?? {}
    const tickLabelFontSize = Math.max(
      10,
      (typeof tickLabelProps.fontSize === 'number' && tickLabelProps.fontSize) || 0
    )

    const tickYCoord =
      to.y + (horizontal && orientation !== Orientation.top ? tickLabelFontSize : 0)

    return (
      <Group
        key={`visx-tick-${value}-${index}`}
        className={['visx-axis-tick', tickClassName].filter(Boolean).join(' ')}
        transform={tickTransform}
      >
        {{
          default: () => [
            !hideTicks ? (
              <Line
                from={from}
                to={to}
                {...{
                  stroke: tickStroke,
                  'stroke-width': strokeWidth,
                  'stroke-linecap': 'square',
                  ...tickLineProps
                }}
              />
            ) : null,
            tickComponent ? (
              tickComponent({
                ...tickLabelProps,
                x: to.x,
                y: tickYCoord,
                formattedValue
              })
            ) : (
              <Text
                x={to.x}
                y={tickYCoord}
                {...tickLabelProps}
                text={formattedValue}
              />
            )
          ]
        }}
      </Group>
    )
  }) as VNode[]
}
